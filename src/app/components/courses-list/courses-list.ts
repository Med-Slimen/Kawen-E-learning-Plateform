import { Component, inject, OnInit } from '@angular/core';
import { CourseService } from '../../services/courseService/course-service';
import { Course } from '../../models/course';
import { NavBar } from '../layoutComponents/dashboard-nav-bar/nav-bar';

@Component({
  selector: 'app-courses-list',
  imports: [NavBar],
  templateUrl: './courses-list.html',
  styleUrl: './courses-list.css',
})
export class CoursesList implements OnInit {
  courseService=inject(CourseService);
  courses?:Course[];
  constructor() {}
  async ngOnInit() {
    this.courses=await this.courseService.getCourses();
  }
}
