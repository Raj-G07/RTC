import {Store} from "./Store";
import {UserId,Chat,Room} from "../schema/Chat.schema";
let globalChatId = 0;

export class InMemoryStore extends Store {
    private rooms: Map<string, Room> = new Map();

    constructor() {
        super();
    }

    initRoom(roomId: string): void {
        if (!this.rooms.has(roomId)) {
            this.rooms.set(roomId, { roomid: roomId, chats: [] });
        }
    }

    getChats(room: string, limit: number, offset: number): Chat[] {
        const roomData = this.rooms.get(room);
        if (!roomData) return [];
        return roomData.chats.reverse().slice(0, offset).slice(-1 * limit)
    }

    addChat(userId: UserId, name: string, room: string, message: string) {
        if(!this.rooms.get(room)) {
            this.initRoom(room);
        }
        const roomData = this.rooms.get(room);
        if (!roomData) return;
        // Check if the chat already exists
        else{
            const chat: Chat = { id: (globalChatId++).toString(), userId, name, message, upvotes: [] };
            roomData.chats.push(chat);
            return chat;
        }
    }

    upvote(userId: UserId, room: string, chatId: string) {
        const roomData = this.rooms.get(room);
        if (!roomData) return;
        else {
            const chat = roomData.chats.find(c => c.id === chatId);
            if (chat && !chat.upvotes.includes(userId)) {
                chat.upvotes.push(userId);
            }
            return chat;
        }
    }
}