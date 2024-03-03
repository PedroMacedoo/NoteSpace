import { Socket } from 'socket.io';

type OperationData = {
  type: 'insert' | 'delete';
  character: string;
};

type CursorChangeData = {
  line: number;
  column: number;
};

const cursorColorsMap = new Map<string, string>();

export default function events(database: Database) {
  function onOperation(socket: Socket, data: OperationData) {
    if (!data.character) throw new Error('Invalid character: ' + data.character);
    switch (data.type) {
      case 'insert': {
        database.insertCharacter(data.character);
        socket.broadcast.emit('operation', data);
        break;
      }
      case 'delete': {
        database.deleteCharacter(data.character);
        socket.broadcast.emit('operation', data);
        break;
      }
      default:
        throw new Error('Invalid operation type');
    }
  }

  function onCursorChange(socket: Socket, position: CursorChangeData) {
    if (!cursorColorsMap.has(socket.id)) {
      const randomColor = 'hsl(' + Math.random() * 360 + ', 100%, 75%)';
      cursorColorsMap.set(socket.id, randomColor);
    }
    const color = cursorColorsMap.get(socket.id);
    socket.broadcast.emit('cursorChange', { position, id: socket.id, color });
  }

  return {
    operation: onOperation,
    cursorChange: onCursorChange,
  };
}
