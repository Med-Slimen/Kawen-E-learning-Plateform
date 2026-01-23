import { Component, inject } from '@angular/core';
import { RouterLink } from "@angular/router";
import { LayoutService } from '../../services/layoutService/layout-service';
import { HomeNavBar } from '../../components/layoutComponents/home-nav-bar/home-nav-bar';

@Component({
  selector: 'app-home-page',
  imports: [RouterLink,HomeNavBar],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage {
}