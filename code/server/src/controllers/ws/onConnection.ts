import { Socket } from 'socket.io';
import { DocumentService, SocketHandler } from '@src/types';
import onCursorChange from '@controllers/ws/document/onCursorChange';

/**
 * Returns a connection handler for socket.io
 * @param service
 * @param events
 */
function onConnection(service: DocumentService, events: Record<string, SocketHandler>) {
  return async (socket: Socket) => {
    console.log('a client connected');

    if (socket.connected) {
      const document = await service.getDocument();
      socket.emit('document', document);
    }

    Object.entries(events).forEach(([event, handler]) => {
      socket.on(event, data => {
        try {
          console.log(event);
          handler(socket, data);
        } catch (e) {
          // socket.emit('error');
          console.error(e);
        }
      });
    });

    socket.on('disconnect', reason => {
      onCursorChange()(socket, null); // delete cursor
      console.log('a client disconnected', reason);
    });
  };
}

export default onConnection;
