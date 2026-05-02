import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { InputTextComponent } from "./components/input-text/input-text.component";
import { ChatComponent } from './components/chat/chat.component';
import { ChatMessage } from './interfaces/chat-message';
import { AiChatService } from './services/ai-chat.service';
import { FooterComponent } from './components/footer/footer.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ScrollToggleButtonComponent } from './components/scroll-toggle-button/scroll-toggle-button.component';


@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    FormsModule,
    InputTextComponent,
    ChatComponent,
    FooterComponent,
    ScrollToggleButtonComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  messages: ChatMessage[] = [];
  isThinking = false;
  selectedModel = 'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free';
  models = [
    {
      name: 'NVIDIA Nemotron 3 Nano Omni',
      value: 'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free',
    },
    {
      name: 'Google Gemma 4',
      value: 'google/gemma-4-26b-a4b-it:free',
    },
    {
      name: 'MiniMax M2.5',
      value: 'minimax/minimax-m2.5:free',
    },
    {
      name: 'Poolside Laguna XS.2',
      value: 'poolside/laguna-xs.2:free',
    },
    {
      name: 'OpenAI: gpt-oss-120b',
      value: 'openai/gpt-oss-120b:free',
    },
    {
      name: 'Baidu Qianfan-OCR-Fast',
      value: 'baidu/qianfan-ocr-fast:free',
    },
    { name: 'LiquidAI LFM2.5-1.2B-Thinking',
      value: 'liquid/lfm-2.5-1.2b-thinking:free'
    },
  ];

  constructor(
    private aiService: AiChatService,
    private changeDetector: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    // Cargar mensajes desde localStorage al iniciar
    const stored = localStorage.getItem('chatMessages');

    // Si hay mensajes guardados, cargarlos
    // y convertir el timestamp a Date
    if (stored) {
      const rawMessages = JSON.parse(stored);
      this.messages = rawMessages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp), // <- convertir a Date
      }));

      this.messages = [...this.messages]; // Forzar la detección de cambios para que Angular actualice la vista
    }
  }

  async handleNewMessage(message: string) {
    //this.messages.push({ from: 'user', content: message, timestamp: new Date() });
    this.messages = [
      ...this.messages,
      { from: 'user', content: message, timestamp: new Date() },
    ];

    // Guardar mensajes del user en localStorage
    this.saveMessagesToLocalStorage();

    // Respuesta de AI
    const aiMessage: ChatMessage = {
      from: 'ai',
      content: '',
      timestamp: new Date(),
    };
    //this.messages.push(aiMessage);
    this.messages = [...this.messages, aiMessage];

    // Mostrar Spinner
    this.isThinking = true;

    // Renderizar a medida que llegan los chunks
    try {
      for await (const chunk of this.aiService.getStreamedResponse(
        message,
        this.selectedModel,
      )) {
        for (const char of chunk) {
          aiMessage.content += char;
          // Reemplazar el último mensaje AI con una nueva copia (para cambiar la referencia)
          this.messages[this.messages.length - 1] = { ...aiMessage };

          // Forzar la actualización al cambiar el array (nueva referencia)
          this.messages = [...this.messages];
          await new Promise((resolve) => setTimeout(resolve, 30));
        }
      }
      aiMessage.timestamp = new Date(); // Actualizar timestamp después de recibir la respuesta
      this.messages[this.messages.length - 1] = aiMessage; // Actualizar el mensaje AI en la lista

      //this.messages = [...this.messages]; // Forzar la detección de cambio

      // Guardar mensajes de AI en localStorage
      this.saveMessagesToLocalStorage();
    } catch (error: any) {
      console.error('App Component Error:', error);

      if (error.message === 'RATE_LIMIT_EXCEEDED') {
        aiMessage.content =
          '🚫 Has alcanzado tu límite de uso diario gratuito. Vuelve mañana o compra créditos.';
      } else if (error.message === 'NO_RESPONSE') {
        aiMessage.content =
          '⚠️ El modelo no pudo generar una respuesta. Intenta de nuevo más tarde.';
      } else {
        aiMessage.content =
          '⚠️ Ocurrió un error inesperado. Intenta nuevamente.';
      }
    } finally {
      this.isThinking = false; // Ocultar spinner
      //this.changeDetector.detectChanges();
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
