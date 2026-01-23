import { inject, Injectable } from '@angular/core';
import { doc, Firestore } from '@angular/fire/firestore';
import { Course } from '../../models/course';
import { collection, getDoc, getDocs } from 'firebase/firestore';
import { User } from '../../models/user';
import { Category } from '../../models/category';
import { Lesson } from '../../models/lessons';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  private firestore = inject(Firestore);
  courses?: Course[];
  constructor() {}
  async getCourses() : Promise<Course[]> {
    const snap= await getDocs(collection(this.firestore, 'courses'));
    this.courses=await Promise.all(snap.docs.map(async (courseDoc)=>{
      const courseDetails=courseDoc.data();
      const intructorId=courseDetails['instructorId'] as string;
      const categoryId=courseDetails['categoryId'] as string;
      const instructorSnap= await getDoc(doc(this.firestore, 'users', intructorId));
      const categorySnap= await getDoc(doc(this.firestore, 'categories', categoryId));
      return{
        uid: courseDoc.id,
        title: courseDetails['title'] as string,
        description: courseDetails['description'] as string,
        duration: courseDetails['duration'] as number,
        instructor: {
          uid: instructorSnap.id,
          ...instructorSnap.data() as Omit<User, 'uid'>
        },
        category: {
          uid: categorySnap.id,
          ...categorySnap.data() as Omit<Category, 'uid'>
        },
        lessons: courseDetails['lessons'] as Lesson[],
        price: courseDetails['price'] as number,
        level: courseDetails['level'] as string,
        thumbnailUrl: courseDetails['thumbnailUrl'] as string,
      } as Course;
    }));
    return this.courses;
  }
  async getCourseById(courseId: string) : Promise<Course> {
    const snap= await getDoc(doc(this.firestore, 'courses', courseId));
    if(!snap.exists()) throw new Error('Course not found');
    return {
      uid: snap.id,
      ...snap.data() as Omit<Course, 'uid'>
    }
  }
}
