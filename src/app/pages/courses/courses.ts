import { Component, inject } from '@angular/core';
import { SessionService } from '../../services/sessionService/session-service';
import { NavBar } from '../../components/layoutComponents/dashboard-nav-bar/nav-bar';
import { HomeNavBar } from '../../components/layoutComponents/home-nav-bar/home-nav-bar';
import { CoursesList } from '../../components/courses-list/courses-list';

@Component({
  selector: 'app-courses',
  imports: [NavBar,HomeNavBar,CoursesList],
  templateUrl: './courses.html',
  styleUrl: './courses.css',
  standalone: true,
})
export class Courses {
  sessionService=inject(SessionService);
  constructor() {}
}
