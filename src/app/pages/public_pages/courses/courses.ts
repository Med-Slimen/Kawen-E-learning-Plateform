import { Component, inject } from '@angular/core';
import { SessionService } from '../../../services/sessionService/session-service';
import { CoursesList } from '../../../components/courses-list/courses-list';

@Component({
  selector: 'app-courses',
  imports: [CoursesList],
  templateUrl: './courses.html',
  styleUrl: './courses.css',
  standalone: true,
})
export class Courses {
  sessionService=inject(SessionService);
  constructor() {}
}
