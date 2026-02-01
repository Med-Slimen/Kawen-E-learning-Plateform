import { User } from "./user";

export interface Verification {
    uid: string;
    cvFileUrl: string;
    linkedinProfileUrl: string;
    portfolioUrl: string;
    instructor:User;
}