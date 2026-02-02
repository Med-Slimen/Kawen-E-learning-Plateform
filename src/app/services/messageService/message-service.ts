import { inject, Injectable } from '@angular/core';
import { Conversation } from '../../models/conversation';
import {
  collection,
  doc,
  Firestore,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { Message } from '../../models/message';
import { User } from '../../models/user';
import { orderBy } from 'firebase/firestore';
import { Notification } from '../../models/notification';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  firestore = inject(Firestore);
  constructor() {}
  async getConversationsByUserId(userId: string): Promise<Conversation[]> {
    const queryGet = query(
      collection(this.firestore, 'conversations'),
      where('participants', 'array-contains', userId),
    );
    const querySnapshot = await getDocs(queryGet);
    const result = Promise.all(
      querySnapshot.docs.map(async (docSnapshot) => {
        const data = docSnapshot.data();
        const receiverId = data['participants'].find((uid: string) => uid !== userId);
        const receiverSnap = await getDoc(doc(this.firestore, 'users', receiverId));
        return {
          uid: docSnapshot.id,
          receiver: {
            uid: receiverSnap.id,
            ...receiverSnap.data(),
          },
          createdAt: data['createdAt'].toDate(),
          updatedAt: data['updatedAt'].toDate(),
          lastMessage: data['lastMessage'],
          status: data['status'],
        } as Conversation;
      }),
    );
    return result;
  }
  listenForMessages(conversationId: string, callback: (messages: Message[]) => void) {
    const queryMessages = query(
      collection(this.firestore, 'messages'),
      where('conversationId', '==', conversationId),
      orderBy('deliveredAt', 'asc'),
    );
    const unsubscribe = onSnapshot(queryMessages, async (querySnapShot) => {
      const messages = await Promise.all(
        querySnapShot.docs.map(async (docSnapshot) => {
          const data = docSnapshot.data();
          const senderId = data['senderId'];
          const sender = await getDoc(doc(this.firestore, 'users', senderId));
          return {
            uid: docSnapshot.id,
            conversationId: data['conversationId'],
            sender: {
              uid: sender.id,
              ...sender.data(),
            },
            content: data['content'],
            deliveredAt: data['deliveredAt'].toDate(),
            status: data['status'],
          } as Message;
        }),
      );
      callback(messages);
    });
    return unsubscribe;
  }
  listenForMessagesNotifications(
    userId: string,selectedConversationId:string,
    callback: (notifications: Notification[]) => void,
  ) {
    const queryNotifications = query(
      collection(this.firestore, 'messageNotifications'),
      where('userId', '==', userId),
    );
    const unsubscribe = onSnapshot(queryNotifications, async (snapshot) => {
      const messagesNotifications =await  Promise.all(snapshot.docs.map(async (docSnapshot) => {
        if(selectedConversationId && docSnapshot.data()['conversationId']===selectedConversationId){
          await updateDoc(doc(this.firestore, 'messageNotifications', docSnapshot.id), {
            read: true,
          });
        }
        const notification = {
          uid: docSnapshot.id,
          ...docSnapshot.data(),
        };
        return notification;
      }));
      callback(messagesNotifications as Notification[]);
    });
    
    return unsubscribe;
  }
}
