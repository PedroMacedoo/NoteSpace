import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '../../test-utils';
import SlateEditor from '@editor/slate/SlateEditor';

const EDITOR_PLACEHOLDER = 'Start writing...';

describe('SlateEditor', () => {
  let editor: HTMLElement;

  beforeEach(async () => {
    const { findByTestId } = render(<SlateEditor />);
    editor = await findByTestId('editor'); // calls 'act' under the hood, but is more readable
    editor.focus();
  });

  it('should render the editor', async () => {
    const h1Title = screen.getByText('NoteSpace');
    const documentTitle = screen.getByPlaceholderText('Untitled');

    expect(h1Title).toBeInTheDocument();
    expect(documentTitle).toBeInTheDocument();
    expect(editor).toHaveTextContent(EDITOR_PLACEHOLDER);
  });
});
