import { Component, inject, Sanitizer } from '@angular/core';
import { CourseService } from '../../../services/courseService/course-service';
import { LessonService } from '../../../services/lessonService/lesson-service';
import { Lesson } from '../../../models/lessons';
import { Course } from '../../../models/course';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { EnrolledCourse } from '../../../models/enrolledCourse';
import { EnrolledCourselessons } from '../../../models/EnrolledCourselessons';
import { updateDoc } from 'firebase/firestore';
import { doc, Firestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-view-course',
  imports: [RouterLink],
  templateUrl: './view-course.html',
  styleUrl: './view-course.css',
})
export class ViewCourse {
  courseService = inject(CourseService);
  lessonService = inject(LessonService);
  firestore = inject(Firestore);
  sanitizer = inject(DomSanitizer);
  loading: boolean = false;
  completedLessons: number = 0;
  percentageCompleted: number = 0;
  enrolledCourse: EnrolledCourse | null = null;
  enrolledCourselessons: EnrolledCourselessons[] = [];
  private enrolledCourseId:string|null = null;
  selectedLesson: EnrolledCourselessons | null = null;
  safeUrl:SafeResourceUrl | null = null;
  constructor(private route: ActivatedRoute) {}
  async ngOnInit() {
    try{
    this.enrolledCourseId = this.route.snapshot.paramMap.get('EnrolledCourseId');
    if (this.enrolledCourseId) {
      await this.getEnrolledCourseById(this.enrolledCourseId);
      await this.getEnrolledCourselessonsById(this.enrolledCourseId);
    }
    else{
      alert('No enrolledCourseId provided in route.');
      return;
    }
    }catch(error){
      alert('Error initializing view course page:' + error);
    }
  }
  async getEnrolledCourseById(enrolledCourseId: string): Promise<void> {
    try {
      this.loading = true;
      this.enrolledCourse = await this.courseService.getEnrolledCourseById(enrolledCourseId);
    } catch (error) {
      alert('Error fetching enrolled course:' + error);
    } finally {
      this.loading = false;
    }
  }
  async getEnrolledCourselessonsById(enrolledCourseId:string):Promise<void>{
    try {
      this.loading = true;
      this.enrolledCourselessons = await this.courseService.getEnrolledCourseLessonsById(enrolledCourseId,this.enrolledCourse!.course.uid);
      this.enrolledCourselessons.sort((a,b)=> (a.lesson && b.lesson) ? a.lesson.order - b.lesson.order : 0);
      this.completedLessons = this.enrolledCourselessons.filter(lesson => lesson.completed).length;
      this.percentageCompleted =Math.round((this.completedLessons / this.enrolledCourselessons.length) * 100);
    } catch (error) {
      alert('Error fetching enrolled course lessons:' + error);
    } finally {
      this.loading = false;
    }
  }
  selectEnrolledCourselesson(enrolledCourselessons: EnrolledCourselessons): void {
    this.selectedLesson = enrolledCourselessons ?? null;
    if(enrolledCourselessons.lesson && enrolledCourselessons.lesson.contentUrl){
      this.setIframeUrl(enrolledCourselessons.lesson.contentUrl);
    }
    else{
      this.safeUrl=null;
      this.selectedLesson=null;
      alert('Lesson is invalid.');
      return;
    }
  }
  isAllowed(url: string): boolean {
  return (
    url.startsWith('https://www.youtube.com/') ||
    url.startsWith('https://www.youtube-nocookie.com/') ||
    url.startsWith('https://res.cloudinary.com/')
  );
}
toYoutubeEmbedUrl(url: string): string {
  // youtu.be/ID
  const short = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (short?.[1]) {
    return `https://www.youtube.com/embed/${short[1]}`;
  }

  // youtube.com/watch?v=ID
  const long = url.match(/[?&]v=([a-zA-Z0-9_-]+)/);
  if (long?.[1]) {
    return `https://www.youtube.com/embed/${long[1]}`;
  }

  // already embed or unknown
  return url;
}
isYoutubeUrl(url: string): boolean  {
  return /youtube\.com|youtu\.be/.test(url);
}
setIframeUrl(url: string) {
  if (!this.isAllowed(url)) {
    alert('The provided URL is not allowed for embedding.');
    return;
  }
  this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.toYoutubeEmbedUrl(url));
}
async markAsComplete(selectedLessonId:string):Promise<void>{
  const confirm=window.confirm('Are you sure you want to mark this lesson as complete?');
  if(!confirm){
    return;
  }
  const oldCompletedLessons=this.completedLessons;
  const oldPercentageCompleted=this.percentageCompleted;
  try{
    this.selectedLesson!.completed=true;
    this.completedLessons = this.completedLessons + 1;
    this.percentageCompleted =Math.round((this.completedLessons / this.enrolledCourselessons.length) * 100);
    await updateDoc(doc(this.firestore,`courses_enrolls/${this.enrolledCourseId}/lessons_progress/${selectedLessonId}`),{
      completed:true
    });
    await updateDoc(doc(this.firestore,`courses_enrolls/${this.enrolledCourseId}`),{
      percentageCompleted: this.percentageCompleted
    });
  }catch(error){
    this.selectedLesson!.completed=false;
    this.completedLessons=oldCompletedLessons;
    this.percentageCompleted=oldPercentageCompleted;
    alert('Error marking lesson as complete:' + error);
  }
}
async markAsUncomplete(selectedLessonId:string):Promise<void>{
   const confirm=window.confirm('Are you sure you want to mark this lesson as uncomplete?');
  if(!confirm){
    return;
  }
  const oldCompletedLessons=this.completedLessons;
  const oldPercentageCompleted=this.percentageCompleted;
  try{
    this.selectedLesson!.completed=false;
    this.completedLessons = this.completedLessons - 1;
    this.percentageCompleted =Math.round((this.completedLessons / this.enrolledCourselessons.length) * 100);
    await updateDoc(doc(this.firestore,`courses_enrolls/${this.enrolledCourseId}/lessons_progress/${selectedLessonId}`),{
      completed:false
    });
    await updateDoc(doc(this.firestore,`courses_enrolls/${this.enrolledCourseId}`),{
      percentageCompleted: this.percentageCompleted
    });
  }catch(error){
    this.selectedLesson!.completed=true;
    this.completedLessons=oldCompletedLessons;
    this.percentageCompleted=oldPercentageCompleted;
    alert('Error marking lesson as uncomplete:' + error);
  }
}
}