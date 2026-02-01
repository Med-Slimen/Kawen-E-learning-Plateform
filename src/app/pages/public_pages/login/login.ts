import { Component, inject, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/authService/auth-service';
import { Router, RouterLink } from "@angular/router";
import { User } from '../../../models/user';
import { SessionService } from '../../../services/sessionService/session-service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginForm!:FormGroup;
  error:number=0;
  loading=false;
  authService= inject(AuthService);
  errorMessage=this.authService.errorMessage;
  sessionService = inject(SessionService);
  errorType:Error | null = null;
  // private authService= Inject(AuthService);
  constructor(private fb:FormBuilder, private router: Router) {}
  ngOnInit(){
    this.sessionService.ready?.then(()=>{
      if(this.sessionService.isLoggedIn()){
        if(this.sessionService.user()?.role==='Student'){
          this.router.navigate(['/Student_Dashboard']);
        }
        else if(this.sessionService.user()?.role==='Admin'){
          this.router.navigate(['/Admin_Main_Page']);
        }
        else if(this.sessionService.user()?.role==='Instructor'){
          this.router.navigate(['/Instructor_Dashboard']);
        }
      }
    });
    this.loginForm=this.fb.group({
      email:['',[Validators.required,Validators.email]],
      password:['',[Validators.required]]
    });
  }
  login():void{
    this.loading=true;
    this.authService.clearErrorMessage();
    this.authService.login(this.loginForm.value.email,this.loginForm.value.password).then((isLoggedIn)=>{
      this.sessionService.ready?.then(()=>{
      if(this.sessionService.isLoggedIn()){
        if(this.sessionService.user()?.role==='Student'){
          this.router.navigate(['/Student_Dashboard']);
        }
        else if(this.sessionService.user()?.role==='Admin'){
          this.router.navigate(['/Admin_Main_Page']);
        }
        else if(this.sessionService.user()?.role==='Instructor'){
          this.router.navigate(['/Instructor_Dashboard']);
        }
      }
    }).catch((error)=>{
      return;
    });
  }).catch((error)=>{
    return;
  })
  .finally(() => {
    this.loading = false;
  });
  }
}
