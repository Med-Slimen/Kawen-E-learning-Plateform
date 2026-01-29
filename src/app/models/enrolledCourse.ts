import { Course } from "./course";
import { User } from "./user";

export interface EnrolledCourse {
    uid: string;
    course: Course;
    enrollmentDate: Date;
    studentId: string;
}