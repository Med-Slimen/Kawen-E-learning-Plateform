import { inject, Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  firestore=inject(Firestore);
  constructor() {}
  saveNotification(notification: any) {
    // Implementation to save notification to Firestore
  }
}
