import { Component, inject } from '@angular/core';
import { NavBar } from '../../../components/layoutComponents/dashboard-nav-bar/nav-bar';
import { Conversation } from '../../../models/conversation';
import { MessageService } from '../../../services/messageService/message-service';
import { SessionService } from '../../../services/sessionService/session-service';
import { Message } from '../../../models/message';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  ɵInternalFormsSharedModule,
} from '@angular/forms';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  Firestore,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  writeBatch,
} from '@angular/fire/firestore';
import { DatePipe } from '@angular/common';
import { getDocs, where } from 'firebase/firestore';
import { Unsubscribe } from 'firebase/auth';
import { Notification } from '../../../models/notification';

@Component({
  selector: 'app-messages',
  imports: [NavBar, ɵInternalFormsSharedModule, ReactiveFormsModule, DatePipe],
  templateUrl: './messages.html',
  styleUrl: './messages.css',
})
export class Messages {
  messages: Message[] = [];
  notifications: Notification[] = [];
  conversations: Conversation[] = [];
  messageService = inject(MessageService);
  sessionService = inject(SessionService);
  firestore = inject(Firestore);
  selectedConversation: Conversation | null = null;
  loading: boolean = false;
  loadingDelete: boolean = false;
  messageForm: FormGroup;
  today: Date = new Date();
  showMessageActionsMenu: boolean = false;
  showMessageActionsMenuId: string | null = null;
  showConversationActionsMenu: boolean | null = null;
  showConversationActionsMenuId: string | null = null;
  unsubscribeForMessages: Unsubscribe | null = null;
  unsubscribeForMessagesNotifications: Unsubscribe | null = null;
  constructor(private formBuilder: FormBuilder) {
    this.messageForm = this.formBuilder.group({
      messageContent: ['', [Validators.required, Validators.maxLength(500)]],
    });
  }
  async ngOnInit() {
    this.conversations = await this.messageService.getConversationsByUserId(
      this.sessionService.user()!.uid,
    );
    this.listenForMessagesNotifications();
  }
  notificationCount(conversationId: string): number {
    return this.notifications.filter(
      (notification) => notification.conversationId === conversationId && !notification.read,
    ).length;
  }
  selectConversation(conversation: Conversation) {
    this.unsubscribeForMessages?.();
    this.selectedConversation = conversation;
    if (conversation.status === 'open') {
      this.listenForMessages();
    } else {
      this.unsubscribeForMessages?.();
      this.messages = [];
    }
  }
  async sendMessage() {
    if(this.selectedConversation && this.selectedConversation.status !== 'open'){
      alert('Cannot send messages in a conversation that is not open.');
      return;
    }
    try {
      if (this.selectedConversation && this.messageForm.valid) {
        const newMessageContent = this.messageForm.value['messageContent'];
        const message = {
          conversationId: this.selectedConversation.uid,
          senderId: this.sessionService.user()!.uid,
          content: newMessageContent,
          deliveredAt: new Date(),
          status: 'sent',
        };
        await addDoc(collection(this.firestore, 'messages'), message);
        this.selectedConversation.lastMessage = newMessageContent;
        await updateDoc(doc(this.firestore, 'conversations', this.selectedConversation.uid), {
          lastMessage: newMessageContent,
          updatedAt: new Date(),
        });
        const notification={
          userId: this.selectedConversation.receiver.uid,
          conversationId: this.selectedConversation.uid,
          title: `New message from ${this.sessionService.user()!.name}`,
          content: newMessageContent,
          read: false,
          timestamp: new Date(),
        }
        await addDoc(collection(this.firestore, 'messageNotifications'),notification);
        this.messageForm.reset();
      } else {
        return;
      }
    } catch (error) {
      alert('Error sending message:' + error);
    } finally {
    }
  }
  async deleteMessage(message: Message) {
    const confirm = window.confirm('Are you sure you want to delete this message?');
    if (!confirm) {
      return;
    }
    const oldMessage = message;
    const oldlastMessage = this.selectedConversation?.lastMessage;
    try {
      this.loadingDelete = true;
      message.content = 'This message has been deleted.';
      await updateDoc(doc(this.firestore, 'messages', message.uid), {
        content: 'This message has been deleted.',
        status: 'deleted',
      });

      if (this.selectedConversation?.lastMessage == oldMessage.content) {
        this.selectedConversation.lastMessage = 'This message has been deleted.';
        await updateDoc(doc(this.firestore, 'conversations', this.selectedConversation.uid), {
          lastMessage: 'This message has been deleted.',
        });
      }
      alert('Message deleted successfully.');
    } catch (error) {
      alert('Error deleting message: ' + error);
      message = oldMessage;
      this.selectedConversation!.lastMessage = oldlastMessage!;
    } finally {
      this.showMessageActionsMenu = false;
      this.showMessageActionsMenuId = null;
      this.loadingDelete = false;
    }
  }
  showMessageActions(messageId: string) {
    this.showMessageActionsMenu = !this.showMessageActionsMenu;
    this.showMessageActionsMenuId = messageId;
  }
  showConversationActions(conversationId: string) {
    this.showConversationActionsMenu = !this.showConversationActionsMenu;
    this.showConversationActionsMenuId = conversationId;
  }
  async acceptRequest() {
    const confirm = window.confirm('Are you sure you want to accept this conversation request?');
    if (!confirm) {
      return;
    }
    const oldConversationStatus = this.selectedConversation?.status;
    try {
      this.loading = true;
      await updateDoc(doc(this.firestore, 'conversations', this.selectedConversation!.uid), {
        status: 'open',
      });
      alert('Conversation request accepted.');
      this.selectedConversation!.status = 'open';
    } catch (error) {
      alert('Error accepting conversation request: ' + error);
      this.selectedConversation!.status = oldConversationStatus!;
    } finally {
      this.loading = false;
    }
  }
  async rejectRequest() {
    const confirm = window.confirm('Are you sure you want to reject this conversation request?');
    if (!confirm) {
      return;
    }
    const oldConversationStatus = this.selectedConversation?.status;
    try {
      this.selectedConversation!.status = 'rejected';
      await updateDoc(doc(this.firestore, 'conversations', this.selectedConversation!.uid), {
        status: 'rejected',
      });
      alert('Conversation request rejected.');
    } catch (error) {
      alert('Error accepting conversation request: ' + error);
      this.selectedConversation!.status = oldConversationStatus!;
    }
  }
  async markConversationClosed() {
    const confirm = window.confirm('Are you sure you want to close this conversation?');
    if (!confirm) {
      return;
    }
    const oldConversationStatus = this.selectedConversation?.status;
    try {
      this.selectedConversation!.status = 'closed';
      await updateDoc(doc(this.firestore, 'conversations', this.selectedConversation!.uid), {
        status: 'closed',
      });
      alert('Conversation closed.');
    } catch (error) {
      alert('Error closing conversation: ' + error);
      this.selectedConversation!.status = oldConversationStatus!;
    }
  }
  async deleteConversation(conversation: Conversation) {
    const confirm = window.confirm(
      'Are you sure you want to delete this conversation? All messages will be lost.',
    );
    if (!confirm) {
      return;
    }
    const oldConversations = this.conversations;
    const oldSelectedConversation = this.selectedConversation;
    try {
      this.loading = true;
      this.selectedConversation = null;
      const batch = writeBatch(this.firestore);
      this.conversations = this.conversations.filter((conv) => conv.uid !== conversation.uid);
      const queryMessages = query(
        collection(this.firestore, 'messages'),
        where('conversationId', '==', conversation.uid),
      );
      const messages = await getDocs(queryMessages);
      messages.docs.forEach((msgDoc) => {
        batch.delete(doc(this.firestore, 'messages', msgDoc.id));
      });
      batch.delete(doc(this.firestore, 'conversations', conversation.uid));
      await batch.commit();
      this.selectedConversation = null;
      alert('Conversation deleted successfully.');
    } catch (error) {
      alert('Error deleting conversation: ' + error);
      this.conversations = oldConversations;
      this.selectedConversation = oldSelectedConversation;
    } finally {
      this.loading = false;
    }
  }
  listenForMessages(): void {
    this.unsubscribeForMessages = this.messageService.listenForMessages(this.selectedConversation!.uid, (newMessages) => {
      this.messages = newMessages;
    });
  }
  listenForMessagesNotifications(): void {
    this.unsubscribeForMessagesNotifications = this.messageService.listenForMessagesNotifications(this.sessionService.user()!.uid,this.selectedConversation!.uid ,(notifications) => {
      this.notifications = notifications;
    });
  }
  ngOnDestroy() {
    this.unsubscribeForMessages?.();
    this.unsubscribeForMessagesNotifications?.();
  }
}
