import { ViewportScroller } from '@angular/common';
import { Component, inject } from '@angular/core';
import { LayoutService } from '../../services/layoutService/layout-service';
import { AuthService } from '../../services/authService/auth-service';
import { Router } from '@angular/router';
import { NavBar } from "../../components/layoutComponents/nav-bar/nav-bar";

@Component({
  selector: 'app-student-dashboard',
  imports: [NavBar],
  templateUrl: './student-dashboard.html',
  styleUrl: './student-dashboard.css',
})
export class StudentDashboard {
  authService=inject(AuthService)
  constructor(private layoutService: LayoutService,private router: Router) {}
}
