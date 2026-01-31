import { User } from "./user";

export interface Message {
    uid: string;
    conversationId: string;
    sender: User;
    content: string;
    deliveredAt: Date;
    isRead: boolean;
}