import { inject, Injectable, OnInit } from '@angular/core';
import { doc, Firestore } from '@angular/fire/firestore';
import { Course } from '../../models/course';
import { collection, deleteDoc, getDoc, getDocs } from 'firebase/firestore';
import { User } from '../../models/user';
import { Category } from '../../models/category';
import { Lesson } from '../../models/lessons';

@Injectable({
  providedIn: 'root',
})
export class CourseService implements OnInit {
  private firestore = inject(Firestore);
  courses?: Course[];
  constructor() {}
  async ngOnInit() {
    this.courses = await this.getCourses();
  }
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
        } as Course;
      }),
    );
    return this.courses;
  }
  async getCourseById(courseId: string): Promise<Course> {
    await this.ngOnInit();
    return this.courses?.find((course) => course.uid === courseId) as Course;
  }
  async getCoursesByInstructor(instructorId: string): Promise<Course[]> {
    await this.ngOnInit();
    return this.courses?.filter((course) => course.instructor.uid === instructorId) || [];
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
}
