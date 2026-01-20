import { ViewportScroller } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";
import { LayoutService } from '../../services/layoutService/layout-service';

@Component({
  selector: 'app-home-page',
  imports: [RouterLink],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage {
  mobileMenuOpen = false;
  constructor(private layoutService: LayoutService) {}
  toggleMenu(menu: boolean): void {
    menu = this.layoutService.toggleMenu(menu);
  }
  scrollTo(anchor: string): void {
    this.layoutService.scrollTo(anchor);
  }
}