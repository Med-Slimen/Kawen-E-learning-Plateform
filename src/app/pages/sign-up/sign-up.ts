import { Component, inject } from '@angular/core';
import { RouterLink } from "@angular/router";
import { AuthService } from '../../services/authService/auth-service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../models/user';

@Component({
  selector: 'app-sign-up',
  imports: [RouterLink,ReactiveFormsModule],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css',
})
export class SignUp {
  private selectedRole: string='Student';
  private authService= inject(AuthService);
  private fb= inject(FormBuilder);
  signUpForm!:FormGroup;
  user!:User;
  ngOnInit(){
    this.signUpForm=this.fb.group({
      name:['',[Validators.required,Validators.minLength(3)]],
      lastName:['',[Validators.required,Validators.minLength(3)]],
      email:['',[Validators.required,Validators.email]],
      password:['',[Validators.required,Validators.minLength(6)]]
    });
    document.getElementById(this.selectedRole)?.classList.remove('bg-gray-100')
    document.getElementById(this.selectedRole)?.classList.add('bg-green-200');
  }
  constructor() {}
  singUp(): void {
    const user:User={
      id: '',
      name: this.signUpForm.value.name,
      lastName: this.signUpForm.value.lastName,
      email: this.signUpForm.value.email,
      password: this.signUpForm.value.password,
      role: this.selectedRole
    };
    this.authService.signUp(user);
  }
  selectRole(role: string): void {
    this.selectedRole = role;
    if(role==='Student'){
      document.getElementById('Student')?.classList.add('bg-green-200');
      document.getElementById('Student')?.classList.remove('bg-gray-100');
      document.getElementById('Instructor')?.classList.remove('bg-green-200');
      document.getElementById('Instructor')?.classList.add('bg-gray-100');
    }
    else{
      document.getElementById('Instructor')?.classList.add('bg-green-200');
      document.getElementById('Instructor')?.classList.remove('bg-gray-100');
      document.getElementById('Student')?.classList.remove('bg-green-200');
      document.getElementById('Student')?.classList.add('bg-gray-100');
    }
    console.log(`Selected role: ${this.selectedRole}`);
  }
  
}
