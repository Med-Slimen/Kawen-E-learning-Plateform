import { ViewportScroller } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { LayoutService } from '../../../services/layoutService/layout-service';
import { AuthService } from '../../../services/authService/auth-service';
import { Router, RouterLink } from '@angular/router';
import { NavBar } from "../../../components/layoutComponents/dashboard-nav-bar/nav-bar";
import { User } from 'firebase/auth';
import { SessionService } from '../../../services/sessionService/session-service';

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
  constructor(private router: Router) {
    }
  ngOnInit(): void {
  }
}
