import { Category } from "./category";
import { Lesson } from "./lessons";
import { User } from "./user";

export interface Course {
    uid: string;
    title: string;
    description: string;
    duration: number; // duration in hours
    instructor: User;
    category: Category;
    price: number;
    level:string;
    thumbnailUrl: string;
    lessonsCount: number;
}