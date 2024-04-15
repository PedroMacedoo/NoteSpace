import { BaseSelection, Editor } from 'slate';
import { Fugue } from '@editor/crdt/fugue';
import { Communication } from '@socket/communication';
import { InputHandlers } from '@editor/domain/input/types';
import { Cursor, Selection } from '@notespace/shared/types/cursor';
import { nodeInsert } from '@editor/crdt/utils';
import { InlineStyle } from '@notespace/shared/types/styles';
import { Operation } from '@notespace/shared/crdt/types/operations';

export default (editor : Editor, fugue : Fugue, communication : Communication): InputHandlers => {

  function onDeleteSelectionHandler(selection : Selection) {
    const operations = fugue.deleteLocal(selection);
    communication.emitChunked('operation', operations);
  }

  function onKeyHandler(key : string, cursor : Cursor, styles : InlineStyle[]) {
    const operations = fugue.insertLocal(cursor, nodeInsert(key, styles));
    communication.emitChunked('operation', operations);
  }

  function onEnterHandler(cursor : Cursor) {
    const operations = fugue.insertLocal(cursor, '\n');
    const styleOperation = fugue.updateBlockStyleLocal('paragraph', cursor.line, true);
    communication.emitChunked('operation', [styleOperation, ...operations]);
  }

  function onBackspaceHandler(cursor : Cursor) {
    const operations = fugue.deleteLocalByCursor(cursor);
    if (operations) communication.emit('operation', operations);
  }

  function onDeleteHandler(cursor : Cursor) {
    const operations = fugue.deleteLocalByCursor(cursor);
    if (operations) communication.emit('operation', operations);
  }

  function onPasteHandler(start : Cursor, chars : string[], lineNodes : string[]) {
    const operations: Operation[] = fugue.insertLocal(start, ...chars);
    for (let i = 0; i < lineNodes.length; i++) {
      const styleOperation = fugue.updateBlockStyleLocal('paragraph', start.line + i, true);
      operations.push(styleOperation);
    }
    communication.emitChunked('operation', operations);
  }

  function onTabHandler(cursor : Cursor, tab : string) {
    const operations = fugue.insertLocal(cursor, tab);
    communication.emit('operation', operations);
  }

  function onSelectionHandler(range : BaseSelection) {
    communication.emit('cursorChange', range);
  }

}