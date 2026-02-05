import { Component, inject } from '@angular/core';
import { Cloudinary } from '../../../services/cloudinaryService/cloudinary';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Lesson } from '../../../models/lessons';
import { addDoc, collection } from 'firebase/firestore';
import { doc, Firestore, updateDoc } from '@angular/fire/firestore';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NavBar } from '../../../components/layoutComponents/dashboard-nav-bar/nav-bar';
import { LessonService } from '../../../services/lessonService/lesson-service';
import { Course } from '../../../models/course';
import { CourseService } from '../../../services/courseService/course-service';
import { Location } from '@angular/common';
import { Loading } from '../../../components/layoutComponents/loading/loading';

@Component({
  selector: 'app-instructor-add-lesson',
  imports: [ReactiveFormsModule, NavBar, RouterLink,Loading],
  templateUrl: './instructor-add-lesson.html',
  styleUrl: './instructor-add-lesson.css',
})
export class InstructorAddLesson {
  toggleContent = false;
  typeContent: 'video' | 'pdf' = 'video';
  loading = false;
  course: Course | null = null;
  cloudinaryService = inject(Cloudinary);
  firestore = inject(Firestore);
  lessonService = inject(LessonService);
  courseService = inject(CourseService);
  addLessonFormGroup: FormGroup;
  lessons?: Lesson[];
  lessonFile: File | null = null;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private location:Location
  ) {
    this.addLessonFormGroup = this.formBuilder.group({
      lessonTitle: ['', [Validators.required, Validators.minLength(3)]],
      lessonDuration: ['', [Validators.required, Validators.min(1)]],
      lessonContentUrl: ['', [Validators.required, Validators.pattern('https?://.+')]],
    });
  }
  async ngOnInit() {
    const courseId = this.route.snapshot.paramMap.get('courseId') as string;
    try{
      this.loading = true;
      this.course=await this.courseService.getCourseById(courseId);
    this.lessons = await this.lessonService.getCourseLessons(courseId);
    }catch(error){
      alert("Error fetching course or lessons: " + error);
    }finally{
      this.loading = false;
    }
    
  }
  selectFile(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0] || null;
    if (file) {
      this.lessonFile = file;
    }
  }
  async addLesson(): Promise<void> {
    try {
      let uploadedUrl: string = '';
      if (this.toggleContent) {
        if (!this.lessonFile) {
          alert('Please select a file to upload');
          return;
        }
        this.loading = true;
        uploadedUrl = await this.cloudinaryService.uploadImage(
          this.lessonFile,
          'kawen_courses_content',
          this.typeContent === 'pdf' ? 'raw' : 'video',
        );
      } else {
        uploadedUrl = this.addLessonFormGroup.value.lessonContentUrl;
      }
      const order= this.lessons && this.lessons.length!=0 ? this.lessons[this.lessons.length - 1].order + 1 : 1;
      const Lesson: Omit<Lesson, 'uid'> = {
        title: this.addLessonFormGroup.value.lessonTitle,
        contentType: this.typeContent,
        contentUrl: uploadedUrl,
        duration: this.addLessonFormGroup.value.lessonDuration,
        order:order,
      };
      const courseId = this.route.snapshot.paramMap.get('courseId') as string;
      await addDoc(collection(this.firestore, `courses/${courseId}/lessons`), Lesson);
      await updateDoc(doc(this.firestore, 'courses', courseId), {
        lessonsCount: this.course!.lessonsCount! + 1
      });
      this.addLessonFormGroup.reset();
      alert('Lesson added successfully');
    } catch (error) {
      alert('Error adding lesson file:' + error);
    } finally {
      this.loading = false;
      this.location.back();
    }
  }
  toggleTypeContentFn(event: any) {
    const selectedValue = event.target.value;
    this.typeContent = selectedValue;
    if (this.typeContent === 'pdf') {
      this.addLessonFormGroup.get('lessonDuration')?.clearValidators();
      this.addLessonFormGroup.get('lessonDuration')?.updateValueAndValidity();
    } else {
      this.addLessonFormGroup
        .get('lessonDuration')
        ?.setValidators([Validators.required, Validators.min(1)]);
      this.addLessonFormGroup.get('lessonDuration')?.updateValueAndValidity();
    }
  }
  toggleContentFn() {
    this.toggleContent = !this.toggleContent;
    if (this.toggleContent) {
      this.addLessonFormGroup.get('lessonContentUrl')?.clearValidators();
      this.addLessonFormGroup.get('lessonContentUrl')?.updateValueAndValidity();
      return;
    } else {
      this.addLessonFormGroup
        .get('lessonContentUrl')
        ?.setValidators([Validators.required, Validators.pattern('https?://.+')]);
      this.addLessonFormGroup.get('lessonContentUrl')?.updateValueAndValidity();
    }
  }
}
