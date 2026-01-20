import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/authService/auth-service';
import { Router, RouterLink } from "@angular/router";
import { User } from '../../models/user';

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
  // private authService= Inject(AuthService);
  constructor(private fb:FormBuilder,private authService: AuthService, private router: Router) {}
  ngOnInit(){
    this.loginForm=this.fb.group({
      email:['',[Validators.required,Validators.email]],
      password:['',[Validators.required]]
    });
  }
  login():void{
    this.loading=true;
    this.authService.login(this.loginForm.value.email,this.loginForm.value.password).then((isLoggedIn)=>{
      if(isLoggedIn){
        this.router.navigate(['/Student_Dashboard']);}
      else{
        this.error=1;
      }
      this.loading=false;
  });
  }
}
