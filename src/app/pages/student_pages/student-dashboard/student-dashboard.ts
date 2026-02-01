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
import { addDoc, collection, doc, Firestore, getDoc, getDocs, query, where } from '@angular/fire/firestore';
import { User } from '../../../models/user';

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
  firestore=inject(Firestore);
  loadingEnrolledCourses:boolean=false;
  loadingMessages:boolean=false;
  enrolledCourses:EnrolledCourse[]=[];
  completedCoursesCount:number=0;
  inProgressCoursesCount:number=0;
  constructor(private router: Router) {
  }
  async ngOnInit(): Promise<void> {
    try{
      this.loadingEnrolledCourses = true;
      this.enrolledCourses = await this.courseService.getEnrolledCoursesByStudentId(this.sessionService.user()?.uid || '');
      this.completedCoursesCount=this.enrolledCourses.filter(ec=>ec.percentageCompleted && ec.percentageCompleted>=100).length;
      this.inProgressCoursesCount=this.enrolledCourses.filter(ec=>ec.percentageCompleted && ec.percentageCompleted<100).length;
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
      const participants=[this.sessionService.user()?.uid, instructorUid];
      const queryGet=query(collection(this.firestore,'conversations'),where('participants','==',participants));
      const querySnapshot = await getDocs(queryGet);
      if(!querySnapshot.empty){
        alert("A conversation with this instructor already exists.");
        this.router.navigate(['/Student_Dashboard/Messages']);
        return;
      }
      const conversation={
        participants: [this.sessionService.user()?.uid, instructorUid],
        createdAt: new Date(),
        updatedAt: new Date(),
        lastMessage: "",
        lastMessageSenderId: "",
        status:"pending"
      }
      await addDoc(collection(this.firestore, 'conversations'),conversation);
      alert("Conversation created successfully.Wait for the instructor to accept your request.");
      this.router.navigate(['/Student_Dashboard/Messages']);
    }
    catch (error) {
      alert("Error creating conversation: " + error);
    }finally {
      this.loadingMessages = false;
    }
  }
}
