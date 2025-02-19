import { type Editor } from 'slate';
import operations from './operations/editorOperations';
import markdownHandlers from '@domain/editor/operations/markdown/operations';
import { MarkdownDomainOperations } from '@domain/editor/operations/markdown/types';
import { Fugue } from '@domain/editor/fugue/fugue';
import { Communication } from '@services/communication/communication';

/**
 * Adds markdown support to the editor.
 * @param editor
 * @param handlers
 */
export function withMarkdown(editor: Editor, handlers: MarkdownDomainOperations) {
  const { deleteBackward, insertText, isInline, delete: deleteOperation } = editor;
  const editorOperations = operations(editor, handlers);

  editor.insertText = insert => {
    editorOperations.insertText(insert, insertText);
  };
  editor.insertBreak = () => {
    editorOperations.insertBreak();
  };
  editor.delete = options => {
    editorOperations.deleteSelection(deleteOperation, options);
  };
  editor.deleteBackward = (...args) => {
    editorOperations.deleteBackward(deleteBackward, ...args);
  };
  editor.isInline = n => editorOperations.isInline(n, isInline);
  return editor;
}

export function getMarkdownPlugin(fugue: Fugue, communication: Communication) {
  return (editor: Editor) => {
    const handlers = markdownHandlers(fugue, communication);
    return withMarkdown(editor, handlers);
  };
}
