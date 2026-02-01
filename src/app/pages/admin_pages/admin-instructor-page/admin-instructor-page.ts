import { Component, inject } from '@angular/core';
import { UserService } from '../../../services/userService/user-service';
import { User } from '../../../models/user';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-admin-instructor-page',
  imports: [RouterLink],
  templateUrl: './admin-instructor-page.html',
  styleUrl: './admin-instructor-page.css',
})
export class AdminInstructorPage {
  userService = inject(UserService);
  instructorsList:User[] = [];
  activeInstructors: number = 0;
  pendingInstructors: number = 0;
  verificationId: string = '';
  constructor() {}
  async ngOnInit() {
    this.instructorsList = await this.userService.getAllInstructors();
    this.activeInstructors = this.instructorsList.filter(instructor => instructor.status === 'Active').length;
    this.pendingInstructors = this.instructorsList.filter(instructor => instructor.status === 'Pending').length;
  }
}
