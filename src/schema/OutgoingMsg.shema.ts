type MessagePayload = {
    roomId: string;
    message: string;
    name: string;
    upvotes: number;
    chatId: string;
};

export enum SupportedMessage{
    AppChat = "APP_CHAT",
    UpdateChat = "UPDATE_CHAT",
}

export type OutgoingMessage = {
    type: SupportedMessage.AppChat;
    payload: MessagePayload;
} | {
    type: SupportedMessage.UpdateChat;
    payload: Partial<MessagePayload>;
};