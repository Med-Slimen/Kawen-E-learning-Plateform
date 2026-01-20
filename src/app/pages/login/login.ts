import { Component, inject, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/authService/auth-service';
import { Router, RouterLink } from "@angular/router";
import { User } from '../../models/user';
import { ToastrService } from 'ngx-toastr';

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
  toastr = inject(ToastrService);
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
        setTimeout(() => {
          this.router.navigate(['/Student_Dashboard']);
        }, 3000);
        this.toastr.success('Login Success!', 'Success',{
          timeOut: 3000,
        });
        }
      else{
        this.error=1;
      }
  }).finally(() => {
    this.loading = false;
  });
  }
}
