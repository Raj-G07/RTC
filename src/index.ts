import {server as WebSocketServer} from 'websocket';
import http from 'http';

const server = http.createServer((req, res) => {
  res.writeHead(404);
  res.end();
});
server.listen(8080, () => {
  console.log('Server is listening on port 8080');
});
const wsServer = new WebSocketServer({
  httpServer: server,
  autoAcceptConnections: false
});

function originIsAllowed(origin:string) {
  // Logic to check if the origin is allowed
  return true; // For simplicity, allow all origins
}
wsServer.on('request', (request) => {
    if (!originIsAllowed(request.origin)) {
        request.reject();
        console.log('Connection from origin ' + request.origin + ' rejected.');
        return;
    }
    const connection = request.accept('echo-protocol', request.origin);
    console.log('Connection accepted from ' + request.origin);
    connection.on('message', (message) => {
      if (message.type === 'utf8') {
        console.log('Received Message: ' + message.utf8Data);
        connection.sendUTF('Echo: ' + message.utf8Data);
      } else if (message.type === 'binary') {
        console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
        connection.sendBytes(message.binaryData);
      }
    });
  connection.on('close', () => {
    console.log('Connection closed');
  });
});