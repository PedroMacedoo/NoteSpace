import { Socket } from 'socket.io';
import { DocumentService, SocketHandler } from '@src/types';

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
      socket.on(event, async data => {
        try {
          console.log("Event:", event);
          await handler(socket, data);
        } catch (e) {
          // socket.emit('error');
          console.error(e);
        }
      });
    });

    socket.on('disconnect', reason => {
      // onCursorChange()(socket, null); // this causes a bug, TODO: check later
      console.log('a client disconnected', reason);
    });
  };
}

export default onConnection;
