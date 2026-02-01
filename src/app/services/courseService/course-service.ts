import { inject, Injectable, OnInit } from '@angular/core';
import { doc, Firestore } from '@angular/fire/firestore';
import { Course } from '../../models/course';
import { collection, deleteDoc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { User } from '../../models/user';
import { Category } from '../../models/category';
import { Lesson } from '../../models/lessons';
import { EnrolledCourse } from '../../models/enrolledCourse';
import { LessonService } from '../lessonService/lesson-service';
import { EnrolledCourselessons } from '../../models/EnrolledCourselessons';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  private firestore = inject(Firestore);
  private lessonService = inject(LessonService);
  courses?: Course[];
  constructor() {}
  async getCourses(): Promise<Course[]> {
    const snap = await getDocs(collection(this.firestore, 'courses'));
    this.courses = await Promise.all(
      snap.docs.map(async (courseDoc) => {
        const courseDetails = courseDoc.data();
        const intructorId = courseDetails['instructorId'] as string;
        const categoryId = courseDetails['categoryId'] as string;
        const instructorSnap = await getDoc(doc(this.firestore, 'users', intructorId));
        const categorySnap = await getDoc(doc(this.firestore, 'categories', categoryId));
        return {
          uid: courseDoc.id,
          title: courseDetails['title'] as string,
          description: courseDetails['description'] as string,
          duration: courseDetails['duration'] as number,
          instructor: {
            uid: instructorSnap.id,
            ...(instructorSnap.data() as Omit<User, 'uid'>),
          },
          category: {
            uid: categorySnap.id,
            ...(categorySnap.data() as Omit<Category, 'uid'>),
          },
          lessons: courseDetails['lessons'] as Lesson[],
          price: courseDetails['price'] as number,
          level: courseDetails['level'] as string,
          thumbnailUrl: courseDetails['thumbnailUrl'] as string,
          lessonsCount: courseDetails['lessonsCount'] as number,
        } as Course;
      }),
    );
    return this.courses;
  }
  async getCourseById(courseId: string): Promise<Course> {
    try {
      const courseSnap = await getDoc(doc(this.firestore, 'courses', courseId));
      if (!courseSnap.exists()) {
        throw new Error('Course not found');
      }
      const courseDetails = courseSnap.data();
      const intructorId = courseDetails['instructorId'] as string;
      const categoryId = courseDetails['categoryId'] as string;
      const instructorSnap = await getDoc(doc(this.firestore, 'users', intructorId));
      const categorySnap = await getDoc(doc(this.firestore, 'categories', categoryId));
      return {
        uid: courseSnap.id,
        title: courseDetails['title'] as string,
        description: courseDetails['description'] as string,
        duration: courseDetails['duration'] as number,
        instructor: {
          uid: instructorSnap.id,
          ...(instructorSnap.data() as Omit<User, 'uid'>),
        },
        category: {
          uid: categorySnap.id,
          ...(categorySnap.data() as Omit<Category, 'uid'>),
        },
        lessons: courseDetails['lessons'] as Lesson[],
        price: courseDetails['price'] as number,
        level: courseDetails['level'] as string,
        thumbnailUrl: courseDetails['thumbnailUrl'] as string,
        lessonsCount: courseDetails['lessonsCount'] as number,
      } as Course;
    } catch (error) {
      throw new Error('Error fetching course: ' + error);
    }
  }
  async getCoursesByInstructor(instructorId: string): Promise<Course[]> {
    try {
      const queryGet = query(
        collection(this.firestore, `courses`),
        where('instructorId', '==', instructorId),
      );
      const querySnap = await getDocs(queryGet);
      return Promise.all(
        querySnap.docs.map(async (courseSnap) => {
          const courseDetails = courseSnap.data();
          const categoryId = courseDetails['categoryId'] as string;
          const categorySnap = await getDoc(doc(this.firestore, 'categories', categoryId));
          const intructorId = courseDetails['instructorId'] as string;
          const instructorSnap = await getDoc(doc(this.firestore, 'users', instructorId));
          return {
            uid: courseSnap.id,
            title: courseDetails['title'] as string,
            description: courseDetails['description'] as string,
            duration: courseDetails['duration'] as number,
            instructor: {
              uid: instructorSnap.id,
              ...(instructorSnap.data() as Omit<User, 'uid'>),
            },
            category: {
              uid: categorySnap.id,
              ...(categorySnap.data() as Omit<Category, 'uid'>),
            },
            lessons: courseDetails['lessons'] as Lesson[],
            price: courseDetails['price'] as number,
            level: courseDetails['level'] as string,
            thumbnailUrl: courseDetails['thumbnailUrl'] as string,
            lessonsCount: courseDetails['lessonsCount'] as number,
          } as Course;
        }),
      );
    } catch (error) {
      throw new Error('Error fetching courses by instructor: ' + error);
    }
  }
  async getEnrolledCoursesByStudentId(studentId: string): Promise<EnrolledCourse[]> {
    const queryGet = query(
      collection(this.firestore, `courses_enrolls`),
      where('studentId', '==', studentId),
    );
    const querySnap = await getDocs(queryGet);
    return Promise.all(
      querySnap.docs.map(async (docSnap) => {
        const courseId = docSnap.data()['courseId'] as string;
        const course = await this.getCourseById(courseId);
        return {
          uid: docSnap.id,
          course: course,
          enrollmentDate: docSnap.data()['enrollmentDate'],
          studentId: docSnap.data()['studentId'] as string,
          percentageCompleted: docSnap.data()['percentageCompleted'] as number | undefined,
        } as EnrolledCourse;
      }),
    );
  }
  async deleteCourse(courseId: string): Promise<boolean> {
    try {
      await deleteDoc(doc(this.firestore, 'courses', courseId));
      return true;
    } catch (error) {
      console.error('Error deleting course: ', error);
      return false;
    }
  }
  async getEnrolledCourseById(enrolledCourseId: string): Promise<EnrolledCourse> {
    const enrolledCourseSnap = await getDoc(
      doc(this.firestore, `courses_enrolls/${enrolledCourseId}`),
    );
    if (enrolledCourseSnap.exists()) {
      const courseId = enrolledCourseSnap.data()['courseId'] as string;
      const course = await this.getCourseById(courseId);
      return {
        uid: enrolledCourseSnap.id,
        course: course,
        enrollmentDate: enrolledCourseSnap.data()['enrollmentDate'],
        studentId: enrolledCourseSnap.data()['studentId'] as string,
        percentageCompleted: enrolledCourseSnap.data()['percentageCompleted'] as number | undefined,
      };
    } else {
      throw new Error('Enrolled course not found');
    }
  }
  async getEnrolledCourseLessonsById(enrolledCourseId: string,courseId: string): Promise<EnrolledCourselessons[]> {
    try {
      const enrolledCourseSnap = await getDocs(
        collection(this.firestore, `courses_enrolls/${enrolledCourseId}/lessons_progress`),
      );
      return Promise.all(
        enrolledCourseSnap.docs.map(async (docSnap) => {
          const lesson= await this.lessonService.getLessonById(courseId,docSnap.data()['lessonId']);
          return {
            uid: docSnap.id,
            lesson: lesson ?? undefined,
            completed: docSnap.data()['completed'] as boolean,
          } as EnrolledCourselessons;
        })
      );
    } catch (error) {
      throw new Error('Error fetching enrolled course lessons: ' + error);
    }
  }
  async getCoursesCountByInstructorId(instructorId: string): Promise<number> {
    try {
      const queryGet = query(
        collection(this.firestore, `courses`),
        where('instructorId', '==', instructorId),
      );
      const querySnap = await getDocs(queryGet);
      return querySnap.size;
    } catch (error) {
      throw new Error('Error fetching courses count by instructor: ' + error);
    }
  }
}
