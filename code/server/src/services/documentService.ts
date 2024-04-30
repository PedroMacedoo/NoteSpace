import { DocumentDatabase, DocumentService } from '@src/types';
import { FugueTree } from '@notespace/shared/crdt/FugueTree';
import { Nodes } from '@notespace/shared/crdt/types/nodes';
import {
  DeleteOperation,
  InsertOperation,
  InlineStyleOperation,
  BlockStyleOperation,
  ReviveOperation,
  Operation,
} from '@notespace/shared/crdt/types/operations';
import { InvalidParameterError } from '@domain/errors/errors';

export default function DocumentService(database: DocumentDatabase): DocumentService {
  const tree = new FugueTree<string>();

  async function getDocuments() {
    return await database.getDocuments();
  }

  async function createDocument() {
    return await database.createDocument();
  }

  async function getDocument(id: string) {
    return await database.getDocument(id);
  }

  async function deleteDocument(id: string) {
    await database.deleteDocument(id);
  }

  async function applyOperations(id: string, operations: Operation[]) {
    await updateDocument(id, async () => {
      for (const operation of operations) {
        switch (operation.type) {
          case 'insert':
            await insertCharacter(operation);
            break;
          case 'delete':
            await deleteCharacter(operation);
            break;
          case 'inline-style':
            await updateInlineStyle(operation);
            break;
          case 'block-style':
            await updateBlockStyle(operation);
            break;
          case 'revive':
            await reviveCharacter(operation);
            break;
          default:
            throw new InvalidParameterError('Invalid operation type');
        }
      }
    });
  }

  async function insertCharacter(operation: InsertOperation) {
    const { id, value, parent, side, styles } = operation;
    tree.addNode(id, value, parent, side, styles);
  }

  async function deleteCharacter(operation: DeleteOperation) {
    const { id } = operation;
    tree.deleteNode(id);
  }

  async function updateInlineStyle(operation: InlineStyleOperation) {
    const { id, style, value } = operation;
    tree.updateInlineStyle(id, style, value);
  }

  async function updateBlockStyle(operation: BlockStyleOperation) {
    const { style, line } = operation;
    tree.updateBlockStyle(style, line);
  }

  async function reviveCharacter(operation: ReviveOperation) {
    const { id } = operation;
    tree.reviveNode(id);
  }

  async function updateDocument(id: string, update: () => void) {
    const { nodes } = await database.getDocument(id);
    tree.setTree(nodes);
    update();
    const updatedNodes = getNodes();
    await database.updateDocument(id, { nodes: updatedNodes });
  }

  function getNodes(): Nodes<string> {
    return Object.fromEntries(Array.from(tree.nodes.entries()));
  }

  async function updateTitle(id: string, title: string) {
    await database.updateDocument(id, { title });
  }

  return {
    getDocuments,
    createDocument,
    getDocument,
    deleteDocument,
    updateTitle,
    applyOperations,
  };
}
