import { Component, inject } from '@angular/core';
import { SessionService } from '../../../services/sessionService/session-service';
import { NavBar } from '../../../components/layoutComponents/dashboard-nav-bar/nav-bar';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CourseService } from '../../../services/courseService/course-service';
import { Course } from '../../../models/course';
import { Cloudinary } from '../../../services/cloudinaryService/cloudinary';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { getDoc, updateDoc } from 'firebase/firestore';
import { doc, Firestore } from '@angular/fire/firestore';
import { CategoryService } from '../../../services/categoryService/category-service';
import { Category } from '../../../models/category';

@Component({
  selector: 'app-instructor-edit-course',
  imports: [NavBar,ReactiveFormsModule,RouterLink],
  templateUrl: './instructor-edit-course.html',
  styleUrl: './instructor-edit-course.css',
})
export class InstructorEditCourse {
  sessionService=inject(SessionService);
  courseService=inject(CourseService);
  cloudinaryService=inject(Cloudinary);
  firestore=inject(Firestore);
  categoryService=inject(CategoryService);
  categories?:Category[];
  editCourseForm:FormGroup
  thumbnailPreview: string | null = this.course?.thumbnailUrl || null;
  thumbnailFile: File | null = null;
  thumbnailUrl: string | null = null;
  uploading = false;
  courseId?:string;
  course?:Course;
  constructor(private fb:FormBuilder,private router:Router,private route:ActivatedRoute){
    this.editCourseForm=this.fb.group({
      courseTitle:['',[Validators.required, Validators.minLength(5),Validators.maxLength(100)]],
      courseDescription:['',[Validators.required, Validators.minLength(20),Validators.maxLength(500)]],
      courseDuration:[''],
      coursePrice:[''],
      courseLevel:[''],
      courseCategory:[''],
      instructorId:[''],
      courseImage:[''],
    })}
  async ngOnInit(){
    this.categories=await this.categoryService.getAllCategories();
    this.courseId=this.route.snapshot.paramMap.get('courseId') as string;
    try{
    await this.getCourseById(this.courseId);
    this.thumbnailPreview=this.course?.thumbnailUrl || null;
    this.editCourseForm.patchValue({
      courseTitle:this.course?.title as string,
      courseDescription:this.course?.description,
      courseDuration:this.course?.duration,
      coursePrice:this.course?.price,
      courseLevel:this.course?.level,
      courseCategory:this.course?.category.title,
      instructorId:this.course?.instructor.uid,
    });
    this.thumbnailUrl=this.course?.thumbnailUrl || null;
  }
    catch (error) {
      alert('Error fetching course details: ' + (error as Error).message);
    }
  }
  async editCourse():Promise<void>{
    if(this.thumbnailUrl===null){
      alert("Please upload a thumbnail image before editing the course.");
      return;
    }
    try{
      const cateogry=await this.categoryService.getCategoryByTitle(this.editCourseForm.value.courseCategory);
      const editedCourse={
      title:this.editCourseForm.value.courseTitle,
      description:this.editCourseForm.value.courseDescription,
      duration:this.editCourseForm.value.courseDuration,
      price:this.editCourseForm.value.coursePrice,
      level:this.editCourseForm.value.courseLevel,
      category:cateogry.uid,
      instructorId:this.editCourseForm.value.instructorId,
      thumbnailUrl:this.thumbnailUrl,
    };
    await updateDoc(doc(this.firestore,'courses',this.courseId as string),editedCourse);
    alert("Course edited successfully");
    this.router.navigate(['../../'],{relativeTo:this.route});
    }catch(error){
      alert("Error editing course: " + (error as Error).message);
      return;
    }
    
  }
  async getCourseById(courseId:string):Promise<void>{
    try{
      this.course = await this.courseService.getCourseById(courseId);
    } catch (error) {
      alert('Error fetching course details: ' + (error as Error).message);
    }
  }
  selectThumbnail(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.thumbnailFile = input.files[0];
      const reader = new FileReader();
      reader.onload = e => {
        this.thumbnailPreview = e.target?.result as string;
      };
      reader.readAsDataURL(this.thumbnailFile);
    }
  }
  async uploadThumbnail() {
    if (!this.thumbnailFile) return;
    this.uploading = true;
    try {
      this.thumbnailUrl = await this.cloudinaryService.uploadImage(this.thumbnailFile);
    } finally {
      this.uploading = false;
    }
  }
}