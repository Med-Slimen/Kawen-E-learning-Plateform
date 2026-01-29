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
export class CourseService implements OnInit {
  private firestore = inject(Firestore);
  private lessonService = inject(LessonService);
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
          lessonsCount: courseDetails['lessonsCount'] as number,
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
  async getEnrolledCoursesByStudentId(studentId: string): Promise<EnrolledCourse[]> {
    const queryGet =query(collection(this.firestore, `courses_enrolls`),where("studentId","==",studentId));
    const querySnap=await getDocs(queryGet);
    return Promise.all(querySnap.docs.map(async (docSnap)=>{
      const courseId=docSnap.data()['courseId'] as string;
      const course = await this.getCourseById(courseId);
      const lessonsProgress=await getDocs(collection(this.firestore,`courses_enrolls/${docSnap.id}/lessons_progress`));
      const enrolledCourselessons: EnrolledCourselessons[] =await Promise.all(
        lessonsProgress.docs.map(async (docSnap)=>{
          const lessonId=docSnap.data()['lessonId'] as string;
          const lesson=await this.lessonService.getLessonById(courseId,lessonId);
          const completed=docSnap.data()['completed'] as boolean;
          return{
            uid:docSnap.id,
            lesson:lesson ?? undefined,
            completed:completed
          };
      }));
      return{
        uid:docSnap.id,
        course:course,
        enrollmentDate: docSnap.data()['enrollmentDate'] ,
        studentId:docSnap.data()['studentId'] as string,
        enrolledCourselessons:enrolledCourselessons,
        percentageCompleted:docSnap.data()['percentageCompleted'] as number || 0
      } as EnrolledCourse;
    }));
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
  async getEnrolledCourseById(enrolledCourseId:string):Promise<EnrolledCourse>{
    const enrolledCourseSnap = await getDoc(doc(this.firestore,`courses_enrolls/${enrolledCourseId}`));
    if(enrolledCourseSnap.exists()){
      const courseId=enrolledCourseSnap.data()['courseId'] as string;
      const course=await this.getCourseById(courseId);
      const lessonsProgress=await getDocs(collection(this.firestore,`courses_enrolls/${enrolledCourseId}/lessons_progress`));
      const enrolledCourselessons: EnrolledCourselessons[] =await Promise.all(
        lessonsProgress.docs.map(async (docSnap)=>{
          const lessonId=docSnap.data()['lessonId'] as string;
          const lesson=await this.lessonService.getLessonById(courseId,lessonId);
          const completed=docSnap.data()['completed'] as boolean;
          return{
            uid:docSnap.id,
            lesson:lesson ?? undefined,
            completed:completed
          };
      }));
        enrolledCourselessons.sort((a,b)=> {
          return a.lesson!.order - b.lesson!.order;}
        );
        return{
          uid:enrolledCourseSnap.id,
          course:course,
          enrollmentDate: enrolledCourseSnap.data()['enrollmentDate'] ,
          studentId:enrolledCourseSnap.data()['studentId'] as string,
          enrolledCourselessons: enrolledCourselessons,
        };
      } else {
        throw new Error('Enrolled course not found');
      }
    }
  }