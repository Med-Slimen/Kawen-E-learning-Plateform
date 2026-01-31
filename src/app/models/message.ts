import { User } from "./user";

export interface Message {
    uid: string;
    conversationId: string;
    sender: User;
    content: string;
    deliveredAt: Date;
    status:string;
    isRead: boolean;
}