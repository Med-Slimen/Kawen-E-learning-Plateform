import { ViewportScroller } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { LayoutService } from '../../../services/layoutService/layout-service';
import { AuthService } from '../../../services/authService/auth-service';
import { Router, RouterLink } from '@angular/router';
import { NavBar } from "../../../components/layoutComponents/dashboard-nav-bar/nav-bar";
import { User } from 'firebase/auth';
import { SessionService } from '../../../services/sessionService/session-service';
import { CourseService } from '../../../services/courseService/course-service';
import { Course } from '../../../models/course';
import { EnrolledCourse } from '../../../models/enrolledCourse';

@Component({
  selector: 'app-student-dashboard',
  imports: [NavBar,RouterLink],
  templateUrl: './student-dashboard.html',
  styleUrl: './student-dashboard.css',
})
export class StudentDashboard implements OnInit {
  user :User | null=null;
  authService=inject(AuthService)
  sessionService=inject(SessionService);
  courseService=inject(CourseService);
  loadingEnrolledCourses:boolean=false;
  enrolledCourses:EnrolledCourse[]=[];
  constructor(private router: Router) {
    }
  async ngOnInit(): Promise<void> {
    try{
      this.loadingEnrolledCourses = true;
      this.enrolledCourses = await this.courseService.getEnrolledCoursesByStudentId(this.sessionService.user()?.uid || '');
    }catch(error){
      alert("Error loading enrolled courses: " + error);
    } 
    finally {
      this.loadingEnrolledCourses = false;
    }
  }
}
