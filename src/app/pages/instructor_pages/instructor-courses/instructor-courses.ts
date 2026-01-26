import { Component, inject } from '@angular/core';
import { NavBar } from '../../../components/layoutComponents/dashboard-nav-bar/nav-bar';
import { CourseService } from '../../../services/courseService/course-service';
import { Course } from '../../../models/course';
import { SessionService } from '../../../services/sessionService/session-service';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-instructor-courses',
  imports: [NavBar, RouterLink],
  templateUrl: './instructor-courses.html',
  styleUrl: './instructor-courses.css',
})
export class InstructorCourses {
  courseService=inject(CourseService);
  sessionService=inject(SessionService);
  courses?: Course[];
  constructor() {}
  async ngOnInit() {
    this.courses = await this.courseService.getCoursesByInstructor(this.sessionService.user()!.uid);
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
