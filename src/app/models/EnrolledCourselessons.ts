import { Lesson } from "./lessons";

export interface EnrolledCourselessons {
    uid: string;
    lesson?: Lesson;
    completed: boolean;
}