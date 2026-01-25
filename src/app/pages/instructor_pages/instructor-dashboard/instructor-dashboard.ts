import { Component } from '@angular/core';
import { NavBar } from '../../../components/layoutComponents/dashboard-nav-bar/nav-bar';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-instructor-dashboard',
  imports: [NavBar, RouterLink],
  templateUrl: './instructor-dashboard.html',
  styleUrl: './instructor-dashboard.css',
})
export class InstructorDashboard {

}
