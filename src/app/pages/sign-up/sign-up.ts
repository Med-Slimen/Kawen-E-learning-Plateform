import { Component, inject } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { AuthService } from '../../services/authService/auth-service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../models/user';
import { SessionService } from '../../services/sessionService/session-service';

@Component({
  selector: 'app-sign-up',
  imports: [RouterLink,ReactiveFormsModule],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css',
})
export class SignUp {
  selectedRole: string='Student';
  loading=false;
  private authService= inject(AuthService);
  private fb= inject(FormBuilder);
  signUpForm!:FormGroup;
  user!:User;
  constructor(private router: Router) {}
  sessionService = inject(SessionService);
  ngOnInit(){
    this.sessionService.ready?.then(()=>{
      if(this.sessionService.isLoggedIn()){
        if(this.sessionService.user?.role==='Student'){
          this.router.navigate(['/Student_Dashboard']);
        }
        else if(this.sessionService.user?.role==='Admin'){
          this.router.navigate(['/Admin_Dashboard']);
        }
        else if(this.sessionService.user?.role==='Instructor'){
          this.router.navigate(['/Instructor_Dashboard']);
        }
      }
    });
    this.signUpForm=this.fb.group({
      name:['',[Validators.required,Validators.minLength(3)]],
      lastName:['',[Validators.required,Validators.minLength(3)]],
      email:['',[Validators.required,Validators.email]],
      password:['',[Validators.required,Validators.minLength(6)]]
    });
  }
  singUp(): void {
    this.loading = true;
    this.authService.signUp(this.signUpForm.value.name,this.signUpForm.value.lastName,this.signUpForm.value.email,this.signUpForm.value.password,this.selectedRole).then((res)=>{
      if(res){
        this.router.navigate(['/Login']);
      }else{
        console.error('Sign up failed');
      }
    }).finally(() => {
      this.loading = false;
    });
  }
  selectRole(role: string): void {
    this.selectedRole = role;
  }
  
}
