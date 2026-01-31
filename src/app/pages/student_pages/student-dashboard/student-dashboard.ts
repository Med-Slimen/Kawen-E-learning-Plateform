import { ViewportScroller } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { LayoutService } from '../../../services/layoutService/layout-service';
import { AuthService } from '../../../services/authService/auth-service';
import { Router, RouterLink } from '@angular/router';
import { NavBar } from "../../../components/layoutComponents/dashboard-nav-bar/nav-bar";
import { SessionService } from '../../../services/sessionService/session-service';
import { CourseService } from '../../../services/courseService/course-service';
import { Course } from '../../../models/course';
import { EnrolledCourse } from '../../../models/enrolledCourse';
import { collection, Firestore, getDocs } from '@angular/fire/firestore';
import { User } from '../../../models/user';
import { addDoc } from 'firebase/firestore';
import { Message } from '../../../models/message';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-student-dashboard',
  imports: [NavBar,RouterLink,ReactiveFormsModule],
  templateUrl: './student-dashboard.html',
  styleUrl: './student-dashboard.css',
})
export class StudentDashboard implements OnInit {
  user :User | null=null;
  authService=inject(AuthService)
  sessionService=inject(SessionService);
  courseService=inject(CourseService);
  firestore=inject(Firestore);
  loadingEnrolledCourses:boolean=false;
  loadingMessages:boolean=false;
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
  async createConversation(instructorUid: string): Promise<void> {
    const confirm=window.confirm("Are you sure you want to create a conversation with this instructor?");
    if(!confirm){
      return;
    }
    try{
      this.loadingMessages = true;
      const conversation={
        participants: [this.sessionService.user()?.uid, instructorUid],
        createdAt: new Date(),
        updatedAt: new Date(),
        lastMessage: "",
        lastMessageSenderId: "",
      }
      await addDoc(collection(this.firestore, 'conversations'),conversation);
    }
    catch (error) {
      alert("Error creating conversation: " + error);
    }finally {
      this.loadingMessages = false;
      alert("Conversation created successfully!");
      this.router.navigate(['/Student_Dashboard/Messages']);
    }
  }
}
