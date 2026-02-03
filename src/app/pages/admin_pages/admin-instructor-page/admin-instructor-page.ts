import { Component, inject } from '@angular/core';
import { UserService } from '../../../services/userService/user-service';
import { User } from '../../../models/user';
import { RouterLink } from "@angular/router";
import { Verification } from '../../../models/verification';
import { Location } from '@angular/common';

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
  verifications:Verification[] = [];
  constructor(private location:Location) {}
  async ngOnInit() {
    try{
    this.instructorsList = await this.userService.getAllInstructors();
    this.activeInstructors = this.instructorsList.filter(instructor => instructor.status === 'active').length;
    this.pendingInstructors = this.instructorsList.filter(instructor => instructor.status === 'pending').length;
    this.verifications = await this.userService.getAllVerifications();}
    catch(error){
      alert('Error fetching instructors data: '+error);
      this.location.back();
    }
  }
  getVerificationIdByInstructorId(instructorUid:string):string | undefined{
    const verification = this.verifications.find(v => v.instructor.uid === instructorUid);
    return verification ? verification.uid : undefined;
  }
}
