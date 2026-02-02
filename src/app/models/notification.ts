export interface Notification {
  uid: string;
  userId: string;
  conversationId: string;
  title: string;
  content: string;
  read: boolean;
  timestamp: Date;
}