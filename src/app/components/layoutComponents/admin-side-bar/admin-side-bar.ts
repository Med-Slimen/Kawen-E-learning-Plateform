import { Component, inject } from '@angular/core';
import { AuthService } from '../../../services/authService/auth-service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-side-bar',
  imports: [RouterLink],
  templateUrl: './admin-side-bar.html',
  styleUrl: './admin-side-bar.css',
})
export class AdminSideBar {
  authService=inject(AuthService);
  activeLink: string = 'Dashboard';
  setActiveLink(link: string) {
    this.activeLink = link;
  }
  constructor(private router: Router) {}
  logout() {
    this.authService.logout().then((success) => {
      if (success) {
        this.router.navigate(['/Login']);
      } else {
        alert('Logout failed. Please try again.');
      };
    });
  }
}
