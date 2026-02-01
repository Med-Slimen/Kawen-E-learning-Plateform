import { Component, inject, Inject } from '@angular/core';
import { NavBar } from '../../../components/layoutComponents/dashboard-nav-bar/nav-bar';
import { RouterLink } from "@angular/router";
import { CourseService } from '../../../services/courseService/course-service';
import { SessionService } from '../../../services/sessionService/session-service';

@Component({
  selector: 'app-instructor-dashboard',
  imports: [NavBar, RouterLink],
  templateUrl: './instructor-dashboard.html',
  styleUrl: './instructor-dashboard.css',
})
export class InstructorDashboard {
  studentCount: number = 0;
  courseCount: number = 0;
  courService = inject(CourseService);
  sessionService = inject(SessionService);
  constructor() {}
  async ngOnInit() {
    this.courseCount = await this.courService.getCoursesCountByInstructorId(this.sessionService.user()!.uid);
    this.studentCount = await this.courService.getStudentsCountByInstructorId(this.sessionService.user()!.uid);
  }
}
