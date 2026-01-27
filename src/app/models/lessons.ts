export interface Lesson {
    uid: string;
    title: string;
    contentType: 'video' | 'pdf';
    contentUrl: string;
    duration: number;
    order:number; // order of the lesson in the course
}