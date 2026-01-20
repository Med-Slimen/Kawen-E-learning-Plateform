import { ViewportScroller } from '@angular/common';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  constructor(private viewportScroller: ViewportScroller) {}

  scrollTo(anchor: string): void {
    this.viewportScroller.scrollToAnchor(anchor);
  }
  toggleMenu(menu: boolean): boolean {
    return !menu;
  }
}
