import { Component, inject } from '@angular/core';
import { NavBar } from '../../../components/layoutComponents/dashboard-nav-bar/nav-bar';
import { CourseService } from '../../../services/courseService/course-service';
import { Course } from '../../../models/course';
import { SessionService } from '../../../services/sessionService/session-service';
import { RouterLink } from "@angular/router";
import { Lesson } from '../../../models/lessons';
import { LessonService } from '../../../services/lessonService/lesson-service';

@Component({
  selector: 'app-instructor-courses',
  imports: [NavBar, RouterLink],
  templateUrl: './instructor-courses.html',
  styleUrl: './instructor-courses.css',
})
export class InstructorCourses {
  courseService=inject(CourseService);
  sessionService=inject(SessionService);
  lessonsService=inject(LessonService);
  loadingCourses = false;
  courses?: Course[];
  constructor() {}
  async ngOnInit() {
    await this.getCoursesByInstructorId(this.sessionService.user()!.uid);
  }
  async getCoursesByInstructorId(instructorId: string): Promise<void> {
    try{
      this.loadingCourses = true;
    this.courses = await this.courseService.getCoursesByInstructor(instructorId);
    }catch(error){
      alert("Error fetching courses: " + error);
    }finally{
      this.loadingCourses = false;
    }
  }
  async deleteCourse(courseId: string): Promise<void> {
    const conf = confirm('Are you sure you want to delete this course?');
    if (!conf) {
      return;
    }
    try{
      await this.courseService.deleteCourse(courseId);
      alert("Course deleted successfully");
      await this.ngOnInit();
    }
    catch(error){
      alert("Error deleting course: " + error);
    }
  }
}