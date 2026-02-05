import { Component, inject } from '@angular/core';
import { NavBar } from '../../../components/layoutComponents/dashboard-nav-bar/nav-bar';
import { CourseService } from '../../../services/courseService/course-service';
import { SessionService } from '../../../services/sessionService/session-service';
import { Course } from '../../../models/course';
import { Lesson } from '../../../models/lessons';
import { LessonService } from '../../../services/lessonService/lesson-service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { addDoc, collection, doc, Firestore } from '@angular/fire/firestore';
import { EnrolledCourse } from '../../../models/enrolledCourse';
import { Location } from '@angular/common';
import { Loading } from '../../../components/layoutComponents/loading/loading';

@Component({
  selector: 'app-course-view',
  imports: [NavBar,RouterLink,Loading],
  templateUrl: './course-view.html',
  styleUrl: './course-view.css',
})
export class CourseView {
  courseService=inject(CourseService);
  sessionService=inject(SessionService);
  lessonsService=inject(LessonService);
  firestore=inject(Firestore);
  loadingContent=false;
  loadingEnroll=false;
  courseId?:string;
  studentId?:string;
  course?:Course;
  enrolledCourses:EnrolledCourse[]=[];
  Limitedlessons:Lesson[]=[];
  lessons:Lesson[]=[];
  lessonsProgress?:{
    lessonId:string;
    completed:boolean;
  }[];
  constructor(private route:ActivatedRoute,private location:Location) {}
  async ngOnInit() {
    try{
    this.loadingContent=true;
    this.courseId=this.route.snapshot.paramMap.get('courseId') || undefined;
    this.studentId=this.sessionService.user()?.uid;
    if(this.courseId && this.studentId){
      await this.getCourse(this.courseId);
      await this.getLessons(this.courseId);
      await this.getEnrolledCourses();
    }
    else{
      alert('course not found');
      this.location.back();
    }
    }catch(error){
      alert('Error loading course or lessons: ' + error);
      this.location.back();
    }
    finally{
      this.loadingContent=false;
    }
  }
  isCourseEnrolled(): boolean {
    return this.enrolledCourses.some(enrolledCourse => enrolledCourse.course.uid === this.courseId);
  }
  getCourseEnrolledId(): string {
    return this.enrolledCourses.find(enrolledCourse => enrolledCourse.course.uid === this.courseId)!.uid;
  }
  async getEnrolledCourses(): Promise<void> {
    this.enrolledCourses = await this.courseService.getEnrolledCoursesByStudentId(this.studentId!);
  }
  async getCourse(courseId:string): Promise<void> {
    try{
      this.course = await this.courseService.getCourseById(courseId);
    }
    catch(error){
      console.error('Error fetching course:', error);
    }
  }
  async getLessons(courseId:string): Promise<void> {
    try{
      this.Limitedlessons = await this.lessonsService.getCourseLessons(courseId,3);
      this.lessons = await this.lessonsService.getCourseLessons(courseId);
    }
    catch(error){
      console.error('Error fetching lessons:', error);
    }
  }
  async enrollCourse() : Promise<void> {
    try{
    this.loadingContent=true;
    this.lessonsProgress= this.lessons.map(lesson=>({
      lessonId:lesson.uid,
      completed:false,
    }));
    const enrolled={
      courseId: this.courseId,
      studentId:this.studentId,
      enrolledAt: new Date(),
      percentageCompleted:0,
      instructorId: this.course?.instructor.uid,
    }
    const enrolledSnap=await addDoc(collection(this.firestore,'courses_enrolls'),enrolled);
    this.lessonsProgress.map(async(lessonProgress)=>{
      await addDoc(collection(this.firestore,`courses_enrolls/${enrolledSnap.id}/lessons_progress`), lessonProgress);
    });
    this.enrolledCourses.push({
      uid: enrolledSnap.id,
      course: this.course!,
      enrollmentDate: new Date(),
      studentId: this.studentId!,
      percentageCompleted: 0,
      instructorId: this.course!.instructor.uid,
    });
    alert('Enrolled successfully in the course! Check your dashboard for access.');
    }
    catch(error){
      alert('Error enrolling in course: ' + error);
    }finally{
      this.loadingContent=false;
    }
  }
}
