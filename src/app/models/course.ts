import { Category } from "./category";
import { Lesson } from "./lessons";
import { User } from "./user";

export interface Course {
    id: string;
    title: string;
    description: string;
    duration: number; // duration in hours
    instructorId: string;
    categoryId: string;
    lessons: Lesson[];
    price: number;
    thumbnail_url: string;
}