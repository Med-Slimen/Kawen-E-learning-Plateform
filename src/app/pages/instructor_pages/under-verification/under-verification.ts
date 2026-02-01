import { Component, inject } from '@angular/core';
import { AuthService } from '../../../services/authService/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-under-verification',
  imports: [],
  templateUrl: './under-verification.html',
  styleUrl: './under-verification.css',
})
export class UnderVerification {
  authService=inject(AuthService);
  loading=false;
  constructor(private router: Router) {}
  async logout(): Promise<void> {
    try{
      this.loading=true;
      const res= await this.authService.logout();
    if(!res){
      alert('Logout failed. Please try again.');
      return;
    }
    this.router.navigate(['/Login']);
    }catch(error){
      console.error('Error during logout:', error);
      alert('An error occurred during logout. Please try again.');
      return;
    }
    finally{
      this.loading=false;
    }
  }
}
