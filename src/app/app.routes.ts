import { Routes } from '@angular/router';
import { HomePage } from './pages/home-page/home_page';
import { Login } from './pages/login/login';

export const routes: Routes = [
    {path: 'Home', component: HomePage },
    {path:'Login',component:Login},
    {path: '', redirectTo: 'Home', pathMatch: 'full' }
];
