import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/authService/auth-service';
import { RouterLink } from "@angular/router";
import { User } from '../../models/user';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginForm!:FormGroup;
  // private authService= Inject(AuthService);
  constructor(private fb:FormBuilder,private authService: AuthService) {}
  ngOnInit(){
    this.loginForm=this.fb.group({
      email:['',[Validators.required,Validators.email]],
      password:['',[Validators.required,Validators.minLength(6)]]
    });
  }
  login():void{
    this.authService.login(this.loginForm.value.email,this.loginForm.value.password);
  }
}
