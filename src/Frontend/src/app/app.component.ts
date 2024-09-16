import { Component, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MessageModels } from '../types/messageModel';

@Injectable()
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Received Messages';
  messages: MessageModels = [];

  constructor(private http: HttpClient) {
    http.get<MessageModels>('api/receivedmessages').subscribe({
      next: (result) => (this.messages = result.sort((a, b) => b.id - a.id)),
      error: console.error,
    });
  }
}
