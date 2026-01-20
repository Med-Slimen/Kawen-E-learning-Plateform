import { Component, inject } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { AuthService } from '../../services/authService/auth-service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../models/user';
import { ToastrService } from 'ngx-toastr';

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
  toastr = inject(ToastrService);
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
        this.toastr.success('Sign up successful! Please log in.', 'Success',{
          timeOut: 3000,
        });
        this.signUpForm.reset();
        setTimeout(() => {
          this.router.navigate(['/Login']);
        }, 3200);
      }else{
        this.toastr.error('Sign up failed! Please try again.', 'Error',{
          timeOut: 3000,
        });
      }
    }).finally(() => {
      this.loading = false;
    });
  }
  selectRole(role: string): void {
    this.selectedRole = role;
  }
  
}
