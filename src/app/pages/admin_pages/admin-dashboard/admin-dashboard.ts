import { Component, inject } from '@angular/core';
import { SessionService } from '../../../services/sessionService/session-service';
import { UserService } from '../../../services/userService/user-service';
import { CourseService } from '../../../services/courseService/course-service';

@Component({
  selector: 'app-admin-dashboard',
  imports: [],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard {
  sessionService=inject(SessionService);
  userService=inject(UserService);
  courseService=inject(CourseService);
  studentsCount: number | null = null;
  instructorsCount: number | null = null;
  coursesCount: number | null = null;
  constructor() {}
  async ngOnInit() {
    try {
      this.studentsCount = await this.userService.getStudentsCount();
      this.instructorsCount = await this.userService.getInstructorsCount();
      this.coursesCount = await this.courseService.getCoursesCount();
    } catch (error) {
      alert('Error loading dashboard data:' + error);
    }
  }
}
