import { range } from 'lodash';
import type { NodeInsert } from '@editor/crdt/types';
import { InlineStyle } from '@notespace/shared/types/styles';

const BASE64CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
const DEFAULT_REPLICA_ID_LENGTH = 10;

/**
 * Generates a random replica id
 * @returns the replica id
 */
export function generateReplicaId() {
  let id = '';
  const charsLength = BASE64CHARS.length;
  range(0, DEFAULT_REPLICA_ID_LENGTH).forEach(() => {
    const randomIndex = Math.floor(Math.random() * charsLength);
    id += BASE64CHARS[randomIndex];
  });
  return id;
}

/**
 * Creates a new insert node to be inserted in the tree
 * @param value
 * @param styles
 * @returns the insert node
 */
export function insertNode(value: string, styles: InlineStyle[]): NodeInsert {
  return { value, styles };
}

/**
 * Breaks the given data into chunks of the given size.
 * Useful for breaking large data into smaller chunks for network transmission
 * @param data
 * @param chunkSize
 * @returns the data chunks
 */
export function chunkData<T>(data: T[], chunkSize: number): T[][] {
  const chunks: T[][] = [];
  range(0, data.length, chunkSize).forEach(i => {
    chunks.push(data.slice(i, i + chunkSize));
  });
  return chunks;
}
