import { Course } from "./course";
import { EnrolledCourselessons } from "./EnrolledCourselessons";
import { Lesson } from "./lessons";
import { User } from "./user";

export interface EnrolledCourse {
    uid: string;
    course: Course;
    enrollmentDate: Date;
    studentId: string;
    enrolledCourselessons: EnrolledCourselessons[];
    percentageCompleted?: number;
}