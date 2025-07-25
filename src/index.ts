import {connection, server as WebSocketServer} from 'websocket';
import http from 'http';
import { UserManager } from './UserManager';
import { InMemoryStore } from './store/InMemory';
import {IncomingMessage} from './schema/IncommingMsg.schema'
import { SupportedMessage } from './schema/IncommingMsg.schema';
import {OutgoingMessage, SupportedMessage as OutgoingSupportedMessages} from "./schema/OutgoingMsg.shema"
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
       try {
        messageHandler(connection, JSON.parse(message.utf8Data) as IncomingMessage);
       } catch (error) {
        console.error('Error parsing message:', error);
        return;
       }
      } else if (message.type === 'binary') {
        console.log('Received binary message of length ' + message.binaryData.length);
        
      }
    });
  connection.on('close', () => {
    console.log('Connection closed');
  });
});

const userManager = new UserManager();
const store = new InMemoryStore();

function messageHandler(ws:connection , message:IncomingMessage){
  if(message.type === SupportedMessage.JoinRoom){
     const payload = message.payload;
     userManager.addUser(payload.name,payload.userId,payload.roomId,ws)
  }

  if(message.type === SupportedMessage.SendMessage){
    const payload = message.payload;
    const user = userManager.getUser(payload.roomId, payload.userId)

    if(!user) {
      return;
    }

    const chat  = store.addChat(payload.userId,user.name,payload.roomId,payload.message)

    if(!chat) {
      return;
    }

    const outgoingPayload: OutgoingMessage = {
      type:OutgoingSupportedMessages.AppChat,
      payload:{
        chatId: chat.id,
        roomId: payload.roomId,
        message: payload.message,
        name: user.name,
        upvotes: 0
      }
    }
    userManager.broadcast(payload.roomId,outgoingPayload,payload.userId)
  }

  if(message.type === SupportedMessage.UpvoteMessage){
    const payload = message.payload;

    const chat = store.upvote(payload.chatId, payload.roomId, payload.userId);

    if(!chat) {
      return;
    }


    const outgoingPayload: OutgoingMessage = {
      type: OutgoingSupportedMessages.UpdateChat,
      payload:{
        chatId: chat.id,
        roomId: payload.roomId,
        upvotes: chat.upvotes.length
      }

    }
    userManager.broadcast(payload.roomId,outgoingPayload,payload.userId)
  }
}