import { type InlineStyle } from '@notespace/shared/src/document/types/styles';
import { NodeType } from '@notespace/shared/src/document/types/nodes';

export type NodeInsert = {
  value: string;
  styles: InlineStyle[];
};

export type FugueNode = NodeType<string>;
