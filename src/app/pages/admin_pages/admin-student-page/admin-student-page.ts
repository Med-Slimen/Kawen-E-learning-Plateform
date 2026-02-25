import { Component, inject } from '@angular/core';
import { UserService } from '../../../services/userService/user-service';
import { User } from '../../../models/user';

@Component({
  selector: 'app-admin-student-page',
  imports: [],
  templateUrl: './admin-student-page.html',
  styleUrl: './admin-student-page.css',
})
export class AdminStudentPage {
  userService=inject(UserService);
  students?:User[];
  activeStudentsCount?:number;
  disabledStudentsCount?:number;
  constructor(){}
  async ngOnInit(){
    await this.getAllStudents();
    await this.getActiveStudents();
    await this.getDisabledStudents();
  }
  async getAllStudents(){
    this.students=await this.userService.getAllStudents();
  }
  async getActiveStudents(){
    this.activeStudentsCount=await this.userService.getActiveStudentsCount();
  }
   async getDisabledStudents(){
    this.disabledStudentsCount=await this.userService.getDisabledStudentsCount();
  }
}
