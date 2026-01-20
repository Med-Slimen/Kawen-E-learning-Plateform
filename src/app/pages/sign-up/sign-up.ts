import { Component, inject } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
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
  selectedRole: string='Student';
  loading=false;
  private authService= inject(AuthService);
  private fb= inject(FormBuilder);
  signUpForm!:FormGroup;
  user!:User;
  constructor(private router: Router) {}
  ngOnInit(){
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
        this.signUpForm.reset();
        this.router.navigate(['/Login']);
      }else{
        alert('Sign up failed! Please try again.');
      }
      this.loading = false;
    });
  }
  selectRole(role: string): void {
    this.selectedRole = role;
  }
  
}
