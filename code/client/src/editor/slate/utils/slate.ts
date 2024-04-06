import type { Descendant } from 'slate';
import type { BlockStyle, InlineStyle } from '@notespace/shared/types/styles.ts';
import type { CustomText } from '@editor/slate/model/types.ts';
import { isEqual, last } from 'lodash';
import { Fugue } from '@editor/crdt/fugue.ts';
import { BlockStyles } from '@notespace/shared/types/styles.ts';

export function fugueToSlate(): Descendant[] {
  const fugue = Fugue.getInstance();
  const root = fugue.getRootNode();
  const descendants: Descendant[] = [];
  let lastStyles: InlineStyle[] = [];
  let lineCounter = 0;

  // create a new paragraph
  const lineStyle = (root.styles[lineCounter++] as BlockStyle) || 'paragraph';
  descendants.push(descendant(lineStyle, ''));

  for (const node of fugue.traverseTree()) {
    const textNode: CustomText = {
      text: node.value as string,
      bold: node.styles.includes('bold'),
      italic: node.styles.includes('italic'),
      underline: node.styles.includes('underline'),
      strikethrough: node.styles.includes('strikethrough'),
      code: node.styles.includes('code'),
    };
    // if new line, add a new paragraph
    if (node.value === '\n') {
      const lineStyle = (root.styles[lineCounter++] as BlockStyle) || 'paragraph';
      descendants.push(descendant(lineStyle, ''));
      lastStyles = node.styles as InlineStyle[];
      continue;
    }
    const lastDescendant = last(descendants);
    // if node styles are the same as the previous one, append the text to it
    if (isEqual(lastStyles, node.styles)) {
      const lastTextNode = last(lastDescendant.children) as CustomText;
      lastTextNode.text += textNode.text;
    }
    // otherwise, create a new block
    else lastDescendant.children.push(textNode);
    lastStyles = node.styles as InlineStyle[];
  }
  return descendants;
}

/**
 * Creates a descendant object.
 * @param type
 * @param children
 * @returns
 */
export const descendant = (type: BlockStyle, ...children: string[]): Descendant => ({
  type,
  children: children.map(text => ({ text })),
});

export const isMultiBlock = (blockStyle: BlockStyle) => {
  const multiBlocks: BlockStyle[] = [BlockStyles.li, BlockStyles.num, BlockStyles.blockquote];
  return multiBlocks.includes(blockStyle);
};
