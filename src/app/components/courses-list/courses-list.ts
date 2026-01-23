import { Component, inject, OnInit } from '@angular/core';
import { CourseService } from '../../services/courseService/course-service';
import { Course } from '../../models/course';

@Component({
  selector: 'app-courses-list',
  imports: [],
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
