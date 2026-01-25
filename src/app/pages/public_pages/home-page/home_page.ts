import { Component, inject } from '@angular/core';
import { RouterLink } from "@angular/router";
import { NavBar } from '../../../components/layoutComponents/dashboard-nav-bar/nav-bar';

@Component({
  selector: 'app-home-page',
  imports: [RouterLink,NavBar],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage {
}