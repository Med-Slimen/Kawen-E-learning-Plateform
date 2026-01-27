import { Component, inject } from '@angular/core';
import { NavBar } from '../../../components/layoutComponents/dashboard-nav-bar/nav-bar';
import { SessionService } from '../../../services/sessionService/session-service';
import { Form, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Cloudinary } from '../../../services/cloudinaryService/cloudinary';
import { Course } from '../../../models/course';
import { addDoc, collection } from 'firebase/firestore';
import { Firestore } from '@angular/fire/firestore';
import { Lesson } from '../../../models/lessons';
import { CategoryService } from '../../../services/categoryService/category-service';
import { RouterLink } from '@angular/router';
import { Category } from '../../../models/category';

@Component({
  selector: 'app-instructor-add-course',
  imports: [NavBar,ReactiveFormsModule,RouterLink],
  templateUrl: './instructor-add-course.html',
  styleUrl: './instructor-add-course.css',
})
export class InstructorAddCourse {
  sessionService=inject(SessionService);
  cloudinaryService=inject(Cloudinary);
  firestore=inject(Firestore);
  categoryService=inject(CategoryService);
  addCourseForm:FormGroup;
  categories?:Category[];
  thumbnailPreview: string | null = null;
  thumbnailFile: File | null = null;
  thumbnailUrl: string | null = null;
  uploading = false;
  addedCourse?:{
    title:string;
    description:string;
    duration:number;
    instructorId:string;
    categoryId:string;
    lessons:Lesson[];
    price:number;
    level:string;
    thumbnailUrl:string;
  };
  constructor(private formBuilder: FormBuilder) {
     this.addCourseForm=this.formBuilder.group({
      courseTitle:['',[Validators.required, Validators.minLength(5),Validators.maxLength(100)]],
      courseDescription:['',[Validators.required, Validators.minLength(20),Validators.maxLength(500)]],
      courseCategory:['Development',[Validators.required]],
      coursePrice:[0,[Validators.required,Validators.min(0)]],
      courseImage:['',[Validators.required]],
      courseLevel:['Beginner',[Validators.required]],
      courseDuration:['',[Validators.required]],
    });
  }
  async ngOnInit(){
    this.categories=await this.categoryService.getAllCategories();
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
      this.thumbnailUrl = await this.cloudinaryService.uploadImage(this.thumbnailFile,'kawen_courses_thumbnails','image');
    } finally {
      this.uploading = false;
    }
  }
  async addCourse() : Promise<void>{ 
    if(this.thumbnailUrl===null){
      alert("Please upload a thumbnail image before adding the course.");
      return;
    }
    const category= await this.categoryService.getCategoryByTitle(this.addCourseForm.value.courseCategory);
    this.addedCourse={
      title:this.addCourseForm.value.courseTitle,
      description:this.addCourseForm.value.courseDescription,
      duration:this.addCourseForm.value.courseDuration,
      instructorId:this.sessionService.user()?.uid as string,
      categoryId:category?.uid as string,
      lessons:[],
      price:this.addCourseForm.value.coursePrice,
      level:this.addCourseForm.value.courseLevel,
      thumbnailUrl:this.thumbnailUrl,
    };
    addDoc(collection(this.firestore,'courses'),this.addedCourse).then((docRef)=>{
      if(docRef){
        alert("Course added successfully!");
        this.addCourseForm.reset();
        this.thumbnailPreview=null;
        this.thumbnailUrl=null;
      }
      else{
        alert("Failed to add course. Please try again.");
      }
  }).catch((error)=>{
    console.error("Error adding course: ",error);
  });
  }
}
