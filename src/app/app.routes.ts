import { Routes } from '@angular/router';
import { HomePage } from './components/home-page/home-page';

export const routes: Routes = [
    { path: 'Home', component: HomePage },
    {path: '', redirectTo: 'Home', pathMatch: 'full' }
];
