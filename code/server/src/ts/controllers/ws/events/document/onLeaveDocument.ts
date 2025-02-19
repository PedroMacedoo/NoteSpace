import { Socket } from 'socket.io';
import rooms from '@controllers/ws/rooms/rooms';
import { deleteCursor } from '@controllers/ws/events/document/onCursorChange';

function onLeaveDocument() {
  return function (socket: Socket) {
    const documentId = rooms.document.get(socket.id)?.id;
    if (!documentId) return;
    deleteCursor(socket, documentId);
    rooms.document.leave(socket);
  };
}

export default onLeaveDocument;
