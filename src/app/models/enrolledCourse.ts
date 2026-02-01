import { Course } from "./course";

export interface EnrolledCourse {
    uid: string;
    course: Course;
    enrollmentDate: Date;
    studentId: string;
    percentageCompleted?: number;
    instructorId: string;
}