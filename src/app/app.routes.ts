import { Routes } from '@angular/router';
import { HomePage } from './pages/home-page/home_page';
import { Login } from './pages/login/login';
import { SignUp } from './pages/sign-up/sign-up';
import { StudentDashboard } from './pages/student-dashboard/student-dashboard';

export const routes: Routes = [
    {path: 'Home', component: HomePage },
    {path:'Login',component:Login},
    {path: 'Sign-Up', component:SignUp},
    {path: 'Student_Dashboard', component:StudentDashboard },
    {path: '', redirectTo: 'Home', pathMatch: 'full' }
];
