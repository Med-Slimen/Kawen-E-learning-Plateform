import { ViewportScroller } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-home-page',
  imports: [RouterLink],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage {
  mobileMenuOpen = false;
  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }
  constructor(private viewportScroller: ViewportScroller) {}

  scrollTo(anchor: string): void {
    this.viewportScroller.scrollToAnchor(anchor);
  }
}