import { Component, inject } from '@angular/core';
import { LayoutService } from '../../../services/layoutService/layout-service';
import { AuthService } from '../../../services/authService/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  imports: [],
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.css',
})
export class NavBar {
  profileMenu = false;
  linksMenu = false;
  authService=inject(AuthService)
  constructor(private layoutService: LayoutService,private router: Router) {}
  scrollTo(anchor: string): void {
    this.layoutService.scrollTo(anchor);
  }
  toggleProfileMenu() {
    this.profileMenu=this.layoutService.toggleMenu(this.profileMenu);
  }
  toggleLinksMenu() {
    this.linksMenu=this.layoutService.toggleMenu(this.linksMenu);
  }
  logout() {
    this.authService.logout().then((success) => {
      if (success) {
        this.router.navigate(['/Login']);
      } else {
        alert('Logout failed. Please try again.');
      }
    });
}
}
