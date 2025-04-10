import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { InputTextComponent } from "./components/input-text/input-text.component";
import { ChatComponent } from './components/chat/chat.component';
import { ChatMessage } from './interfaces/chat-message';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgClass, InputTextComponent, ChatComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'askme-ai';

  messages: ChatMessage[] = [];

  handleNewMessage(message: string) {
    this.messages.push({ from: 'user', content: message });

    // Respuesta mock de AI
    setTimeout(() => {
      this.messages.push({ from: 'ai', content: '🤖 Respuesta automática.' });
    }, 800);
  }
}
