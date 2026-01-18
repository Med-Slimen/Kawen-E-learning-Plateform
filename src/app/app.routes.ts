import { Routes } from '@angular/router';
import { HomePage } from './pages/home-page/home_page';
import { Login } from './pages/login/login';
import { SignUp } from './pages/sign-up/sign-up';

export const routes: Routes = [
    {path: 'Home', component: HomePage },
    {path:'Login',component:Login},
    {path: 'Sign-Up', component:SignUp},
    {path: '', redirectTo: 'Home', pathMatch: 'full' }
];
