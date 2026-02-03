import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NavBar } from '../../../components/layoutComponents/dashboard-nav-bar/nav-bar';
import { Cloudinary } from '../../../services/cloudinaryService/cloudinary';
import { LessonService } from '../../../services/lessonService/lesson-service';
import { doc, Firestore, updateDoc } from '@angular/fire/firestore';
import { Course } from '../../../models/course';
import { CourseService } from '../../../services/courseService/course-service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Lesson } from '../../../models/lessons';
import { Location } from '@angular/common';

@Component({
  selector: 'app-instructor-edit-lesson',
  imports: [ReactiveFormsModule,NavBar,RouterLink],
  templateUrl: './instructor-edit-lesson.html',
  styleUrl: './instructor-edit-lesson.css',
})
export class InstructorEditLesson {
  editLessonFormGroup:FormGroup;
  loading=false;
  typeContent: 'video' | 'pdf' = 'video';
  toggleContent=false;
  course: Course | null = null;
  lessonId:string="";
  courseId:string="";
  lesson:Lesson | null = null;
  lessonFile: File | null = null;
  cloudinaryService=inject(Cloudinary);
  lessonService=inject(LessonService);
  courseService = inject(CourseService);
  firestore = inject(Firestore);
  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute,private location: Location) {
    this.editLessonFormGroup = this.formBuilder.group({
      lessonTitle: ['', [Validators.required, Validators.minLength(3)]],
      lessonDuration: ['', [Validators.required, Validators.min(1)]],
      lessonContentUrl: ['', [Validators.required,Validators.pattern('https?://.+')]],
    });
  }
  async ngOnInit(){
    this.courseId = this.route.snapshot.paramMap.get('courseId') as string;
    this.lessonId = this.route.snapshot.paramMap.get('lessonId') as string;
    this.loading=true;
    this.course=await this.courseService.getCourseById(this.courseId);
    this.lesson=await this.lessonService.getLessonById(this.courseId,this.lessonId);
    if(!this.lesson){
      alert("Lesson not found");
      return;}
    this.editLessonFormGroup.patchValue({
      lessonTitle: this.lesson.title,
      lessonContentUrl: this.lesson.contentUrl,
    });
    if(this.lesson.contentType==='video'){
      this.typeContent='video';
      this.editLessonFormGroup.patchValue({
      lessonDuration: this.lesson.duration,
    });
    }
    else{
      this.typeContent='pdf';
      this.editLessonFormGroup.get('lessonDuration')?.clearValidators();
      this.editLessonFormGroup.get('lessonDuration')?.updateValueAndValidity();
    }
    this.loading=false;
  }
   selectFile(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0] || null;
    if (file) {
      this.lessonFile = file;
    }
  }
  async editLesson(){
    try {
          this.loading = true;
          let uploadedUrl=this.editLessonFormGroup.value.lessonContentUrl;
          if (this.toggleContent) {
            if(this.lessonFile){
              uploadedUrl = await this.cloudinaryService.uploadImage(
              this.lessonFile,
              'kawen_courses_content',
              this.typeContent === 'pdf' ? 'raw' : 'video',
            );
            }
          }
          const lesson: Omit<Lesson, 'uid'> = {
            title: this.editLessonFormGroup.value.lessonTitle,
            contentType: this.typeContent,
            contentUrl: uploadedUrl,
            duration: this.editLessonFormGroup.value.lessonDuration,
            order: this.lesson?.order as number,
          };
          const courseId = this.route.snapshot.paramMap.get('courseId') as string;
          await updateDoc(doc(this.firestore, `courses/${courseId}/lessons/${this.lessonId}`), lesson);
          this.editLessonFormGroup.reset();
          alert('Lesson edited successfully');
        } catch (error) {
          alert('Error editing lesson:' + error);
        } finally {
          this.loading = false;
          this.location.back();
        }
  }
   toggleTypeContentFn(event: any) {
    const selectedValue = event.target.value;
    this.typeContent = selectedValue;
    if (this.typeContent === 'pdf') {
      this.editLessonFormGroup.get('lessonDuration')?.clearValidators();
      this.editLessonFormGroup.get('lessonDuration')?.updateValueAndValidity();
    } else {
      this.editLessonFormGroup
        .get('lessonDuration')
        ?.setValidators([Validators.required, Validators.min(1)]);
      this.editLessonFormGroup.get('lessonDuration')?.updateValueAndValidity();
    }
  }
  toggleContentFn() {
    this.toggleContent = !this.toggleContent;
    if (this.toggleContent) {
      this.editLessonFormGroup.get('lessonContentUrl')?.clearValidators();
      this.editLessonFormGroup.get('lessonContentUrl')?.updateValueAndValidity();
      return;
    } else {
      this.editLessonFormGroup
        .get('lessonContentUrl')
        ?.setValidators([Validators.pattern('https?://.+')]);
      this.editLessonFormGroup.get('lessonContentUrl')?.updateValueAndValidity();
    }
  }
}
