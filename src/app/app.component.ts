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
  imports: [InputTextComponent, ChatComponent],
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
    } catch (error: any) {
        console.error('App Component Error:', error);

        if (error.message === 'RATE_LIMIT_EXCEEDED') {
          aiMessage.content = '🚫 Has alcanzado tu límite de uso diario gratuito. Vuelve mañana o compra créditos.';
        } else if (error.message === 'NO_RESPONSE') {
          aiMessage.content = '⚠️ El modelo no pudo generar una respuesta. Intenta de nuevo más tarde.';
        } else {
          aiMessage.content = '⚠️ Ocurrió un error inesperado. Intenta nuevamente.';
        }
    } finally {
        this.isThinking = false; // Ocultar spinner
    }

    console.log(this.messages);
  }
}
