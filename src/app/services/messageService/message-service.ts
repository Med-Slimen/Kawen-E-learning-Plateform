import { inject, Injectable } from '@angular/core';
import { Conversation } from '../../models/conversation';
import { collection, doc, Firestore, getDoc, getDocs, query, where } from '@angular/fire/firestore';
import { Message } from '../../models/message';
import { User } from '../../models/user';
import { orderBy } from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  firestore=inject(Firestore);
  constructor() {}
  async getConversationsByUserId(userId: string): Promise<Conversation[]> {
   const queryGet=query(collection(this.firestore,'conversations'),where('participants','array-contains',userId));
   const querySnapshot=await getDocs(queryGet);
   const result=Promise.all(querySnapshot.docs.map(async (docSnapshot)=>{
     const data=docSnapshot.data();
     const receiverId=data['participants'].find((uid:string)=>uid!==userId);
      const receiverSnap=await getDoc(doc(this.firestore,'users',receiverId));
     return {
       uid: docSnapshot.id,
       receiver:{
          uid: receiverSnap.id,
          ...receiverSnap.data()
       },
       createdAt: data['createdAt'].toDate(),
       updatedAt: data['updatedAt'].toDate(),
       lastMessage: data['lastMessage'],
        status: data['status']
     } as Conversation;
   }));
   return result;
  }
  async getMessagesByConversationId(conversationId: string): Promise<Message[]> {
    const queryGet=query(collection(this.firestore,'messages'),where('conversationId','==',conversationId),orderBy('deliveredAt','asc'));
    const querySnapshot=await getDocs(queryGet);
    const result=Promise.all(querySnapshot.docs.map(async (docSnapshot)=>{
      const data=docSnapshot.data();
      const senderId=data['senderId'];
      const senderSnap=await getDoc(doc(this.firestore,'users',senderId));
      const sender : User={
        uid: senderSnap.id,
        name: senderSnap.data()?.['name'],
        lastName: senderSnap.data()?.['lastName'],
        email: senderSnap.data()?.['email'],
        role: senderSnap.data()?.['role'],
        pfpUrl: senderSnap.data()?.['pfpUrl'],
        status: senderSnap.data()?.['status']
      };
      return {
        uid: docSnapshot.id,
        sender: sender,
        content: data['content'],
        deliveredAt: data['deliveredAt'].toDate(),
        isRead: data['isRead'],
        status: data['status']
      } as Message;
    }));
    return result;
  }
}
