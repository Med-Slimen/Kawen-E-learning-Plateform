import { Component, inject } from '@angular/core';
import { AdminSideBar } from '../../../components/layoutComponents/admin-side-bar/admin-side-bar';
import { Router, RouterOutlet } from '@angular/router';
import { LayoutService } from '../../../services/layoutService/layout-service';
import { AuthService } from '../../../services/authService/auth-service';
import { SessionService } from '../../../services/sessionService/session-service';

@Component({
  selector: 'app-admin-main-page',
  imports: [AdminSideBar,RouterOutlet],
  templateUrl: './admin-main-page.html',
  styleUrl: './admin-main-page.css',
})
export class AdminMainPage {
  profileMenu = false;
  layoutService=inject(LayoutService);
  authService=inject(AuthService);
  sessionService=inject(SessionService);
  constructor(private router: Router) {}
  toggleProfileMenu() {
    this.profileMenu=this.layoutService.toggleMenu(this.profileMenu);
  }
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
