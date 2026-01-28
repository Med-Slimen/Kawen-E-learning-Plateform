import { Component, inject } from '@angular/core';
import { NavBar } from '../../../components/layoutComponents/dashboard-nav-bar/nav-bar';
import { ActivatedRoute, RouterLink } from "@angular/router";
import { Course } from '../../../models/course';
import { collection, deleteDoc, doc } from 'firebase/firestore';
import { Firestore, getDoc, getDocs } from '@angular/fire/firestore';
import { CourseService } from '../../../services/courseService/course-service';
import { Lesson } from '../../../models/lessons';
import { LessonService } from '../../../services/lessonService/lesson-service';

@Component({
  selector: 'app-instructor-lessons-page',
  imports: [NavBar, RouterLink],
  templateUrl: './instructor-lessons-page.html',
  styleUrl: './instructor-lessons-page.css',
})
export class InstructorLessonsPage {
  courseId:string='';
  course:Course|null=null;
  lessons:Lesson[] = [];
  firestore=inject(Firestore);
  loadingLessons=false;
  loadingCourse=false;
  courseService=inject(CourseService);
  lessonService=inject(LessonService);
  constructor(private route: ActivatedRoute) {}
  async ngOnInit() {
    try{
      await this.getCourseById();
    if(!this.course){
      alert('Course not found');
      return;
    }
    await this.getCourseLessons();
    }catch(error){
      alert('Error loading course or lessons: ' + error);
    }
  }
  async getCourseById(): Promise<void> {
    try{
      this.loadingCourse=true;
    this.courseId = this.route.snapshot.paramMap.get('courseId') || '';
    this.course = await this.courseService.getCourseById(this.courseId);}
    catch(error){
      alert('Error fetching course: ' + error);
    }finally{
      this.loadingCourse=false;
    }
  }
  async getCourseLessons(): Promise<void> {
    try{
      this.loadingLessons=true;
    this.lessons = await this.lessonService.getCourseLessons(this.courseId);
    }catch(error){
      alert('Error fetching lessons: ' + error);
    }finally{
      this.loadingLessons=false;
    }
  }
  async deleteLesson(lessonId:string){
    const confirm=window.confirm('Are you sure you want to delete this lesson?');
    if(!confirm){
      return;
    }
    try{
      this.loadingLessons=true;
      await deleteDoc(doc(this.firestore,`courses/${this.courseId}/lessons`,lessonId));
      await this.getCourseLessons();
      alert('Lesson deleted successfully');
    } catch (error) {
      alert('Error deleting lesson:' + error);
    }finally{
      this.loadingLessons=false;
    }
  }
}
