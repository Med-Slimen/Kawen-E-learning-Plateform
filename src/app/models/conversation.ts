import { User } from "./user";

export interface Conversation{
    uid: string;
    receiver:User;
    createdAt: Date;
    updatedAt: Date;
    lastMessage: string;
    status: string;
}
