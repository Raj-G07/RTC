
import { User, Room } from './schema/User.schema';
import { connection } from 'websocket';
import { OutgoingMessage } from './schema/OutgoingMsg.shema';

export class UserManager {
    private rooms: Map<string, Room>;
    constructor() {
        this.rooms = new Map<string, Room>();
    }
    addUser(name:string,userId:string,roomId:string,socket:connection): void {
        if (!this.rooms.has(roomId)) {
            this.rooms.set(roomId, { users: [] });
            
        }
        const room = this.rooms.get(roomId);
        if (room) {
            const user: User = { id: userId, name, conn: socket };
            room.users.push(user);
        }   
        socket.on('close', () => {
            this.removeUser(userId, roomId);
        });
    }

    removeUser(userId: string,roomId:string): void {
        const users = this.rooms.get(roomId)?.users;
        if (!users) return;
        users.filter(user => user.id !== userId);
    }

    getUser(userId: string,roomId:string): User | null {
        const user = this.rooms.get(roomId)?.users.find(user => user.id === userId);
        if (!user) return null;
        return user;
    }

    getRoom(roomId: string): Room | undefined {
        return this.rooms.get(roomId);
    }
    broadcast(roomId: string, message: OutgoingMessage,userId:string): void {
        const user = this.getUser(roomId,userId);
        if (!user) return;
        const room = this.getRoom(roomId);
        if (!room) return;
        room.users.forEach(user => {
            if (user.id === userId) return; // Skip sending message to the sender
            user.conn.sendUTF(JSON.stringify(message));
        });
    }
}