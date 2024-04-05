import { type Editor, Element, Range, Text, Transforms } from 'slate';
import { Fugue } from '@editor/crdt/fugue';
import { getSelectionByRange } from '@editor/slate/utils/selection';
import { BlockStyle, InlineStyle } from '@notespace/shared/types/styles';
import { Cursor, Selection } from '@notespace/shared/types/cursor';
import { range } from 'lodash';
import { FugueNode } from '@editor/crdt/types';

/**
 * Creates a function that applies a block element to the editor
 * @param type
 */
export function createSetBlockApply(type: BlockStyle) {
  const fugue = Fugue.getInstance();
  return (editor: Editor, range: Range) => {
    const line = range.anchor.path[0];

    const cursor = { line, column: 0 };
    const triggerNodes = fugue.traverseBySeparator(' ', cursor, false).next().value;
    triggerNodes.forEach((node: FugueNode) => fugue.deleteLocalById(node.id));

    fugue.updateBlockStyleLocal(type, line);

    Transforms.setNodes(editor, { type }, { match: n => Element.isElement(n) && editor.isBlock(n), at: range });
  };
}

/**
 * Returns a function that applies an inline style to a block of text in the editor
 * @param key
 * @param triggerLength
 */
export function createSetInlineApply(key: InlineStyle, triggerLength: number) {
  const fugue = Fugue.getInstance();
  return (editor: Editor, range: Range) => {
    // remove trigger characters
    const selection = getSelectionByRange(editor, range, triggerLength);
    deleteAroundSelection(selection, triggerLength);

    // update styles in the tree
    const newSelection = {
      start: { ...selection.start, column: selection.start.column - triggerLength },
      end: { ...selection.end, column: selection.end.column - triggerLength },
    };

    fugue.updateInlineStyleLocal(newSelection, true, key as InlineStyle);

    Transforms.insertNodes(editor, { text: ' ' }, { match: Text.isText, at: Range.end(range), select: true });
    Transforms.setNodes(editor, { [key]: true }, { match: Text.isText, at: range, split: true });
  };
}

/**
 * Deletes characters around the selection
 * @param selection
 * @param amount
 */
function deleteAroundSelection(selection: Selection, amount: number) {
  const fugue = Fugue.getInstance();
  const deleteNodeByCursor = (cursor: Cursor) => {
    const node = fugue.getNodeByCursor(cursor);
    if (node) fugue.deleteLocalById(node.id);
  };
  range(1, amount + 1).forEach(i => {
    const leftCursor = { ...selection.start, column: selection.start.column - i + 1 };
    const rightCursor = { ...selection.end, column: selection.end.column + i };
    deleteNodeByCursor(leftCursor);
    deleteNodeByCursor(rightCursor);
  });
}
