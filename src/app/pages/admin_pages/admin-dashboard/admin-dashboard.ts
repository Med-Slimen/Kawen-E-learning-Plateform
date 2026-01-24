import { Component, inject } from '@angular/core';
import { SessionService } from '../../../services/sessionService/session-service';

@Component({
  selector: 'app-admin-dashboard',
  imports: [],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard {
  sessionService=inject(SessionService);
  constructor() {}
}
