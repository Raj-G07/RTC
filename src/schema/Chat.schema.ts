export type UserId = string;

export interface Chat {
    id: string;
    userId: string;
    message: string;
    name: string;
    upvotes: UserId[];
}

export interface Room {
  roomid: string;
  chats: Chat[];
}