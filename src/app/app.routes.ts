import { Routes } from '@angular/router';
import { HomePage } from './pages/home-page/home_page';
import { Login } from './pages/login/login';
import { SignUp } from './pages/sign-up/sign-up';
import { StudentDashboard } from './pages/student-dashboard/student-dashboard';
import { AdminDashboard } from './pages/admin-dashboard/admin-dashboard';
import { Forbidden } from './pages/forbidden/forbidden';
import { authGuard } from './guards/auth-guard';
import { roleGuard } from './guards/role-guard';
import { CoursesList } from './components/courses-list/courses-list';

export const routes: Routes = [
    {path: 'Home', component: HomePage },
    {path:'Login',component:Login},
    {path: 'Sign-Up', component:SignUp},
    {path:'CoursesList',component:CoursesList},
    {path: 'Student_Dashboard', component:StudentDashboard,canActivate:
    [authGuard,roleGuard],data: { roles: ['Student'] }},
    {path:'Admin_Dashboard',component:AdminDashboard,canActivate:
    [authGuard,roleGuard],data: { roles: ['Admin'] } },
    {path: 'Forbidden', component:Forbidden },
    {path: '', redirectTo: 'Home', pathMatch: 'full' }
];
