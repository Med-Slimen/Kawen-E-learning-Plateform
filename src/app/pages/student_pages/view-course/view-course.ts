import { Component, inject, Sanitizer } from '@angular/core';
import { CourseService } from '../../../services/courseService/course-service';
import { LessonService } from '../../../services/lessonService/lesson-service';
import { Lesson } from '../../../models/lessons';
import { Course } from '../../../models/course';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-view-course',
  imports: [],
  templateUrl: './view-course.html',
  styleUrl: './view-course.css',
})
export class ViewCourse {
  courseService = inject(CourseService);
  lessonService = inject(LessonService);
  sanitizer = inject(DomSanitizer);
  lessons: Lesson[] = [];
  loading: boolean = false;
  course: Course | null = null;
  selectedLesson: Lesson | null = null;
  safeUrl:SafeResourceUrl | null = null;
  constructor(private route: ActivatedRoute) {}
  async ngOnInit() {
    const courseId = this.route.snapshot.paramMap.get('courseId');
    if (courseId) {
      await this.getCourse(courseId);
      await this.getLessons(courseId);
    }
    else{
      alert('No courseId provided in route.');
      return;
    }
  }
  async getCourse(courseId: string): Promise<void> {
    try {
      this.loading = true;
      this.course = await this.courseService.getCourseById(courseId);
    } catch (error) {
      alert('Error fetching course:' + error);
    } finally {
      this.loading = false;
    }
  }
  async getLessons(courseId: string): Promise<void> {
    try {
      this.loading = true;
      this.lessons = await this.lessonService.getCourseLessons(courseId);
    } catch (error) {
      alert('Error fetching lessons: ' + error);
    } finally {
      this.loading = false;
    }
  }
  selectLesson(lesson: Lesson): void {
    this.selectedLesson = lesson;
    if(lesson && lesson.contentUrl){
      this.setIframeUrl(lesson.contentUrl);
    }
    else{
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
isYoutubeUrl(url: string): boolean {
  return /youtube\.com|youtu\.be/.test(url);
}
setIframeUrl(url: string) {
  if (!this.isAllowed(url)) {
    alert('The provided URL is not allowed for embedding.');
    return;
  }
  this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.toYoutubeEmbedUrl(url));
}
}