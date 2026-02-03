import { inject, Injectable } from '@angular/core';
import { collection, deleteDoc, doc, Firestore, getDoc, getDocs, limit, query } from '@angular/fire/firestore';
import { Lesson } from '../../models/lessons';
import { orderBy } from '@angular/fire/firestore';
@Injectable({
  providedIn: 'root',
})
export class LessonService {
  firestore = inject(Firestore);
  constructor() {}
  async getCourseLessons(courseId:string,limitLessons?:number): Promise<Lesson[]> {
    let querySnap;
    if(limitLessons){
       querySnap=query(collection(this.firestore,`courses/${courseId}/lessons`),orderBy("order"),limit(limitLessons));
    }
    else{
     querySnap=query(collection(this.firestore,`courses/${courseId}/lessons`),orderBy("order"));
    }
    const snap=await getDocs(querySnap);
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
