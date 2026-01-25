import { Component, inject } from '@angular/core';
import { LayoutService } from '../../../services/layoutService/layout-service';
import { AuthService } from '../../../services/authService/auth-service';
import { Router, RouterLink } from '@angular/router';
import { SessionService } from '../../../services/sessionService/session-service';

@Component({
  selector: 'app-nav-bar',
  imports: [RouterLink],
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.css',
})
export class NavBar {
  profileMenu = false;
  linksMenu = false;
  mobileMenuOpen = false;
  authService=inject(AuthService);
  sessionService=inject(SessionService);
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
   toggleMenu(menu: boolean): void {
    menu = this.layoutService.toggleMenu(menu);
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
