import { inject, Injectable } from '@angular/core';
import { collection, doc, Firestore, getDoc, getDocs, query } from '@angular/fire/firestore';
import { Lesson } from '../../models/lessons';
import { orderBy } from '@angular/fire/firestore';
@Injectable({
  providedIn: 'root',
})
export class LessonService {
  firestore = inject(Firestore);
  constructor() {}
  async getCourseLessons(courseId:string): Promise<Lesson[]> {
    const snap=await getDocs(query(collection(this.firestore,`courses/${courseId}/lessons`),orderBy("order")));
    return snap.docs.map((lessonDoc)=>{
      const lessonData=lessonDoc.data();
      return {
        uid:lessonDoc.id,
        title:lessonData['title'] as string,
        contentType:lessonData['contentType'] as 'video' | 'pdf',
        contentUrl:lessonData['contentUrl'] as string,
        duration:lessonData['duration'] as number,
        order:lessonData['order'] as number,
      } as Lesson;
    })
  }
  async getLessonById(courseId:string, lessonId:string):Promise<Lesson | null>{
    try{
      const lessonDoc = await getDoc(doc(this.firestore,'courses',courseId,'lessons',lessonId));
      if (lessonDoc.exists()) {
        return {
          uid: lessonDoc.id,
          ...lessonDoc.data(),
        } as Lesson;
      } else {
        return null;
      }
    }
    catch(error){
      alert("Error getting lesson:" + error);
      return null;
    }
  }
}
