import { Component, inject } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { AuthService } from '../../../services/authService/auth-service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../../models/user';
import { SessionService } from '../../../services/sessionService/session-service';

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
  cvFile?:File;
  constructor(private router: Router) {}
  sessionService = inject(SessionService);
  ngOnInit(){
    this.sessionService.ready?.then(()=>{
      if(this.sessionService.isLoggedIn()){
        if(this.sessionService.user()?.role==='Student'){
          this.router.navigate(['/Student_Dashboard']);
        }
        else if(this.sessionService.user()?.role==='Admin'){
          this.router.navigate(['/Admin_Dashboard']);
        }
        else if(this.sessionService.user()?.role==='Instructor'){
          this.router.navigate(['/Instructor_Dashboard']);
        }
      }
    });
    this.signUpForm=this.fb.group({
      name:['',[Validators.required,Validators.minLength(3)]],
      lastName:['',[Validators.required,Validators.minLength(3)]],
      email:['',[Validators.required,Validators.email]],
      password:['',[Validators.required,Validators.minLength(6)]],
      linkedinProfileUrl:[''],
      portfolioUrl:[''],
      cvFile:[''],
    });
  }
  selectCV(event: Event): void {
    this.cvFile = (event.target as HTMLInputElement).files![0];
    console.log(this.cvFile);
  }
  singUp(): void {
    if(this.signUpForm.value.role==='Instructor' && !this.cvFile){
      alert('Please upload your CV.');
      return;
    }
    this.loading = true;
    const pfpUrl='https://res.cloudinary.com/dtz3cpe37/image/upload/v1769806630/default-avatar-icon-of-social-media-user-vector_wnmdy5.jpg';
    this.authService.signUp(this.signUpForm.value.name,this.signUpForm.value.lastName,this.signUpForm.value.email,this.signUpForm.value.password,this.selectedRole,pfpUrl,this.cvFile!,this.signUpForm.value.linkedinProfileUrl,this.signUpForm.value.portfolioUrl).then((res)=>{
      if(res){
        this.router.navigate(['/Login']);
      }else{
        console.error('Sign up failed');
      }
    }).finally(() => {
      this.signUpForm.reset();
      this.cvFile=undefined;
      this.loading = false;
    });
  }
  selectRole(role: string): void {
    this.selectedRole = role;
    if(role==='Student'){
    this.signUpForm.controls['linkedinProfileUrl'].clearValidators();
    this.signUpForm.controls['portfolioUrl'].clearValidators();
    this.signUpForm.controls['cvFile'].clearValidators();
    this.signUpForm.controls['linkedinProfileUrl'].updateValueAndValidity();
    this.signUpForm.controls['portfolioUrl'].updateValueAndValidity();
    this.signUpForm.controls['cvFile'].updateValueAndValidity();
  }
  else if(role==='Instructor'){
    this.signUpForm.controls['linkedinProfileUrl'].setValidators([Validators.required]);
    this.signUpForm.controls['portfolioUrl'].setValidators([Validators.required]);
    this.signUpForm.controls['cvFile'].setValidators([Validators.required]);
    this.signUpForm.controls['linkedinProfileUrl'].updateValueAndValidity();
    this.signUpForm.controls['portfolioUrl'].updateValueAndValidity();
    this.signUpForm.controls['cvFile'].updateValueAndValidity();
  }
}
}
