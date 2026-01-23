import { Component } from '@angular/core';
import { LayoutService } from '../../../services/layoutService/layout-service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home-nav-bar',
  imports: [RouterLink],
  templateUrl: './home-nav-bar.html',
  styleUrl: './home-nav-bar.css',
})
export class HomeNavBar {
  mobileMenuOpen = false;
  constructor(private layoutService: LayoutService) {}
  toggleMenu(menu: boolean): void {
    menu = this.layoutService.toggleMenu(menu);
  }
  scrollTo(anchor: string): void {
    this.layoutService.scrollTo(anchor);
  }
}
