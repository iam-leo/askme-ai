import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { InputTextComponent } from "./components/input-text/input-text.component";
import { ChatComponent } from './components/chat/chat.component';
import { ChatMessage } from './interfaces/chat-message';
import { NgClass } from '@angular/common';
import { AiChatService } from './services/ai-chat.service';
import { SpinnerComponent } from './components/spinner/spinner.component';

@Component({
  selector: 'app-root',
  imports: [InputTextComponent, ChatComponent, SpinnerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  messages: ChatMessage[] = [];
  isThinking = false;

   constructor(private aiService: AiChatService) {}

  async handleNewMessage(message: string) {
    this.messages.push({ from: 'user', content: message });

    // Respuesta de AI
    const aiMessage: ChatMessage = { from: 'ai', content: '' };
    this.messages.push(aiMessage);

    // Mostrar Spinner
    this.isThinking = true;

    // Renderizar a medida que llegan los chunks
    try {
      for await (const chunk of this.aiService.getStreamedResponse(message)) {
        for (const char of chunk) {
          aiMessage.content += char;
          await new Promise(resolve => setTimeout(resolve, 30));
        }
      }
    } finally {
      this.isThinking = false; // Ocultar spinner
    }
  }
}
