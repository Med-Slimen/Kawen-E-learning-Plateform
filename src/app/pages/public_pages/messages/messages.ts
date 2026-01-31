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
import { addDoc, collection, deleteDoc, doc, Firestore, updateDoc } from '@angular/fire/firestore';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-messages',
  imports: [NavBar, ɵInternalFormsSharedModule, ReactiveFormsModule,DatePipe],
  templateUrl: './messages.html',
  styleUrl: './messages.css',
})
export class Messages {
  messages: Message[] = [];
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
  constructor(private formBuilder: FormBuilder) {
    this.messageForm = this.formBuilder.group({
      messageContent: ['', [Validators.required, Validators.maxLength(500)]],
    });
  }
  async ngOnInit() {
    this.conversations = await this.messageService.getConversationsByUserId(
      this.sessionService.user()!.uid,
    );
  }
  async selectConversation(conversation: Conversation) {
    this.selectedConversation = conversation;
    this.messages = await this.messageService.getMessagesByConversationId(conversation.uid);
  }
  async sendMessage() {
    const oldlastMessage = this.selectedConversation?.lastMessage;
    try {
      this.loading = true;
      if (this.selectedConversation && this.messageForm.valid) {
        const newMessageContent = this.messageForm.value['messageContent'];
        const message = {
          conversationId: this.selectedConversation.uid,
          senderId: this.sessionService.user()!.uid,
          content: newMessageContent,
          deliveredAt: new Date(),
          isRead: false,
        };
        await addDoc(collection(this.firestore, 'messages'), message);
        this.selectedConversation.lastMessage = newMessageContent;
        await updateDoc(
          doc(this.firestore, 'conversations', this.selectedConversation.uid),
          { lastMessage: newMessageContent, updatedAt: new Date() },
        );
        this.messages = await this.messageService.getMessagesByConversationId(
          this.selectedConversation.uid,
        );
        this.messageForm.reset();
      } else {
        return;
      }
    } catch (error) {
      alert('Error sending message:' + error);
      this.selectedConversation!.lastMessage = oldlastMessage!;
    } finally {
      this.loading = false;
    }
  }
  async deleteMessage(message: Message) {
    const confirm=window.confirm('Are you sure you want to delete this message?');
    if(!confirm){
      return;
    }
    const oldMessageContent=message.content;
    const oldlastMessage=this.selectedConversation?.lastMessage;
    try{
      this.loadingDelete=true;
      message.content='This message has been deleted.';
      await updateDoc(doc(this.firestore,'messages',message.uid), { content: 'This message has been deleted.' });
      

      if(this.selectedConversation?.lastMessage==oldMessageContent){
        this.selectedConversation.lastMessage='This message has been deleted.';
        await updateDoc(doc(this.firestore,'conversations',this.selectedConversation.uid),{ lastMessage: 'This message has been deleted.'});
      }
      alert('Message deleted successfully.');
    }
    catch(error){
      alert('Error deleting message: '+error);
      message.content=oldMessageContent;
      this.selectedConversation!.lastMessage=oldlastMessage!;
    }finally{
      this.showMessageActionsMenu=false;
      this.showMessageActionsMenuId=null;
      this.loadingDelete=false;
    }
  }
  showMessageActions(messageId: string) {
    this.showMessageActionsMenu = !this.showMessageActionsMenu;
    this.showMessageActionsMenuId = messageId;
  }
}
