import { Routes } from '@angular/router';
import { HomePage } from './pages/public_pages/home-page/home_page';
import { Login } from './pages/public_pages/login/login';
import { SignUp } from './pages/public_pages/sign-up/sign-up';
import { StudentDashboard } from './pages/student_pages/student-dashboard/student-dashboard';
import { AdminDashboard } from './pages/admin_pages/admin-dashboard/admin-dashboard';
import { Forbidden } from './pages/public_pages/forbidden/forbidden';
import { authGuard } from './guards/auth-guard';
import { roleGuard } from './guards/role-guard';
import { CoursesList } from './components/courses-list/courses-list';
import { Courses } from './pages/public_pages/courses/courses';
import { AdminStudentPage } from './pages/admin_pages/admin-student-page/admin-student-page';
import { AdminInstructorPage } from './pages/admin_pages/admin-instructor-page/admin-instructor-page';
import { AdminCategoryPage } from './pages/admin_pages/admin-category-page/admin-category-page';
import { AdminMainPage } from './pages/admin_pages/admin-main-page/admin-main-page';

export const routes: Routes = [
    {path: 'Home', component: HomePage },
    {path:'Login',component:Login},
    {path: 'Sign-Up', component:SignUp},
    {path:'CoursesList',component:CoursesList},
    {path:'Courses',component:Courses},
    {path: 'Student_Dashboard', component:StudentDashboard,canActivate:
    [authGuard,roleGuard],data: { roles: ['Student'] }},
    {path:'Admin_Main_Page',canActivate:
    [authGuard,roleGuard],data: { roles: ['Admin'] } ,
    component:AdminMainPage,
children:[
    {path:'',component:AdminDashboard},
    {path:'Admin_Students_Page',component:AdminStudentPage},
    {path:'Admin_Instructors_Page',component:AdminInstructorPage},
    {path:'Admin_Categories_Page',component:AdminCategoryPage}
]},
    {path: 'Forbidden', component:Forbidden },
    {path: '', redirectTo: 'Home', pathMatch: 'full' }
];
