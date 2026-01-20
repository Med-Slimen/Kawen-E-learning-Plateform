import { ViewportScroller } from '@angular/common';
import { Injectable } from '@angular/core';
import { Route, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  constructor(private viewportScroller: ViewportScroller,private router :Router) {}

  scrollTo(anchor: string): void {
    this.viewportScroller.scrollToAnchor(anchor);
  }
  toggleMenu(menu: boolean): boolean {
    return !menu;
  }
}
