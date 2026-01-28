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
import { AdminStudentPage } from './pages/admin_pages/admin-student-page/admin-student-page';
import { AdminInstructorPage } from './pages/admin_pages/admin-instructor-page/admin-instructor-page';
import { AdminCategoryPage } from './pages/admin_pages/admin-category-page/admin-category-page';
import { AdminMainPage } from './pages/admin_pages/admin-main-page/admin-main-page';
import { InstructorDashboard } from './pages/instructor_pages/instructor-dashboard/instructor-dashboard';
import { InstructorCourses } from './pages/instructor_pages/instructor-courses/instructor-courses';
import { InstructorAddCourse } from './pages/instructor_pages/instructor-add-course/instructor-add-course';
import { InstructorEditCourse } from './pages/instructor_pages/instructor-edit-course/instructor-edit-course';
import { InstructorLessonsPage } from './pages/instructor_pages/instructor-lessons-page/instructor-lessons-page';
import { InstructorAddLesson } from './pages/instructor_pages/instructor-add-lesson/instructor-add-lesson';
import { InstructorEditLesson } from './pages/instructor_pages/instructor-edit-lesson/instructor-edit-lesson';
import { CourseView } from './pages/public_pages/course-view/course-view';

export const routes: Routes = [
    {path: 'Home', component: HomePage },
    {path:'Login',component:Login},
    {path: 'Sign-Up', component:SignUp},
    {path:'CoursesList',children:[
        {path:'',component:CoursesList},
        {path:'CourseView/:courseId',component:CourseView}
    ]},
    {path: 'Student_Dashboard', component:StudentDashboard,canActivate:
    [authGuard,roleGuard],data: { roles: ['Student'] }},
    {path:'Instructor_Dashboard',canActivate:
    [authGuard,roleGuard],data: { roles: ['Instructor'] },
    children:[
        {path:'',component:InstructorDashboard},
        {path:'Instructor_Courses', 
            children:[
                {path:'',component:InstructorCourses},
                {path:'Instructor_add_course',component:InstructorAddCourse},
                {path:'Instructor_edit_course/:courseId',component:InstructorEditCourse},
                {path:'Instructor_lessons_page/:courseId',
                 children:[
                    {path:'',component:InstructorLessonsPage},
                    {path:'Instructor_add_lesson',component:InstructorAddLesson},
                    {path:'Instructor_edit_lesson/:lessonId',component:InstructorEditLesson}
                ]
                }
            ]
        }
    ]
    },
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
