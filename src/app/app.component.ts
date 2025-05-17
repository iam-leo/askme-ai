import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { InputTextComponent } from "./components/input-text/input-text.component";
import { ChatComponent } from './components/chat/chat.component';
import { ChatMessage } from './interfaces/chat-message';
import { AiChatService } from './services/ai-chat.service';
import { FooterComponent } from './components/footer/footer.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-root',
  imports: [CommonModule,FormsModule, InputTextComponent, ChatComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  messages: ChatMessage[] = [];
  isThinking = false;
  selectedModel = 'meta-llama/llama-3.3-70b-instruct:free';
  models = [
    { name: 'Meta Llama 3.3 70B Instruct', value: 'meta-llama/llama-3.3-70b-instruct:free' },
    { name: 'Google Gemini 2.0 Flash Exp', value: 'google/gemini-2.0-flash-exp:free' },
    { name: 'Thudm Glm Z1 9B', value: 'thudm/glm-z1-9b:free' },
    { name: 'Microsoft Mai Ds R1', value: 'microsoft/mai-ds-r1:free' }
  ];

  constructor(private aiService: AiChatService, private changeDetector: ChangeDetectorRef) { }

  ngOnInit() {
    // Cargar mensajes desde localStorage al iniciar
    const stored = localStorage.getItem('chatMessages');

    // Si hay mensajes guardados, cargarlos
    // y convertir el timestamp a Date
    if (stored) {
      const rawMessages = JSON.parse(stored);
      this.messages = rawMessages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp) // <- convertir a Date
      }));
    }
  }

  async handleNewMessage(message: string) {
    //this.messages.push({ from: 'user', content: message, timestamp: new Date() });
    this.messages = [...this.messages, { from: 'user', content: message, timestamp: new Date() }];

    // Guardar mensajes del user en localStorage
    this.saveMessagesToLocalStorage();

    // Respuesta de AI
    const aiMessage: ChatMessage = { from: 'ai', content: '', timestamp: new Date() };
    //this.messages.push(aiMessage);
    this.messages = [...this.messages, aiMessage];


    // Mostrar Spinner
    this.isThinking = true;

    // Renderizar a medida que llegan los chunks
    try {
      for await (const chunk of this.aiService.getStreamedResponse(message, this.selectedModel)) {
        for (const char of chunk) {
          aiMessage.content += char;
          await new Promise(resolve => setTimeout(resolve, 30));
        }
      }
      aiMessage.timestamp = new Date(); // Actualizar timestamp después de recibir la respuesta
      this.messages[this.messages.length - 1] = aiMessage; // Actualizar el mensaje AI en la lista

      // Guardar mensajes de AI en localStorage
      this.saveMessagesToLocalStorage();
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
        this.changeDetector.detectChanges(); // Forzar la detección de cambios
    }
  }

  saveMessagesToLocalStorage() {
    localStorage.setItem('chatMessages', JSON.stringify(this.messages));
  }

  clearChat() {
    this.messages = [];
    localStorage.removeItem('chatMessages');
  }

}
