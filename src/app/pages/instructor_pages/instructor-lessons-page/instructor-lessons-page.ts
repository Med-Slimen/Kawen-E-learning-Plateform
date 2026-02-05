import { Component, inject } from '@angular/core';
import { NavBar } from '../../../components/layoutComponents/dashboard-nav-bar/nav-bar';
import { ActivatedRoute, RouterLink } from "@angular/router";
import { Course } from '../../../models/course';
import { collection, deleteDoc, doc } from 'firebase/firestore';
import { Firestore, getDoc, getDocs, updateDoc, writeBatch } from '@angular/fire/firestore';
import { CourseService } from '../../../services/courseService/course-service';
import { Lesson } from '../../../models/lessons';
import { LessonService } from '../../../services/lessonService/lesson-service';
import { Location } from '@angular/common';
import { Loading } from '../../../components/layoutComponents/loading/loading';

@Component({
  selector: 'app-instructor-lessons-page',
  imports: [NavBar, RouterLink, Loading],
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
  constructor(private route: ActivatedRoute,private location:Location) {}
  async ngOnInit() {
    try{
      this.loadingCourse=true;
      await this.getCourseById();
    if(!this.course){
      alert('Course not found');
      this.location.back();
    }
    this.loadingLessons=true;
    await this.getCourseLessons();
    }catch(error){
      alert('Error loading course or lessons: ' + error);
      this.location.back();
    }finally{
      this.loadingLessons=false;
      this.loadingCourse=false;
    }
  }
  async getCourseById(): Promise<void> {
    try{
      
    this.courseId = this.route.snapshot.paramMap.get('courseId') || '';
    this.course = await this.courseService.getCourseById(this.courseId);}
    catch(error){
      alert('Error fetching course: ' + error);
    }
  }
  async getCourseLessons(): Promise<void> {
    try{
    this.lessons = await this.lessonService.getCourseLessons(this.courseId);
    }catch(error){
      alert('Error fetching lessons: ' + error);
    }
  }
  async deleteLesson(lessonId:string){
    const confirm=window.confirm('Are you sure you want to delete this lesson?');
    if(!confirm){
      return;
    }
    try{
      const batch=writeBatch(this.firestore);
      batch.delete(doc(this.firestore,`courses/${this.courseId}/lessons`,lessonId));
      batch.update(doc(this.firestore, 'courses', this.courseId), {
        lessonsCount: this.course!.lessonsCount! - 1
      });
      await batch.commit();
      await this.getCourseLessons();
      alert('Lesson deleted successfully');
    } catch (error) {
      alert('Error deleting lesson:' + error);
    }
  }
}
