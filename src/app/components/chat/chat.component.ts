import { CommonModule, NgClass } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ChatMessage } from '../../interfaces/chat-message';
import { SpinnerComponent } from '../spinner/spinner.component';
import { MarkdownService, provideMarkdown } from 'ngx-markdown';
import { MarkdownModule } from 'ngx-markdown';


@Component({
  selector: 'chat',
  imports: [CommonModule, NgClass, SpinnerComponent, MarkdownModule],
  providers: [provideMarkdown()],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})

export class ChatComponent implements OnInit, OnChanges {
   @Input() messages: { from: string, content: string, timestamp: Date }[] = [];
   @Input() isThinking: boolean = false;

   constructor(private markdownService: MarkdownService, private cdr: ChangeDetectorRef) {}

    processedMessages: string[] = [];


   ngOnInit() {}

   ngOnChanges(changes: SimpleChanges): void {
    if (changes['messages'] && changes['messages'].currentValue) {
      // Esperar al próximo ciclo para asegurar que la vista esté lista
      Promise.resolve().then(() => this.processMessages());
    }
  }

   // Método asíncrono para procesar contenido Markdown
   async processMessages() {
      // Limpiar mensajes procesados
      this.processedMessages = [];
     for (let msg of this.messages) {
       if (msg.content) {
         // Procesar cada mensaje de contenido Markdown
         this.processedMessages.push(await this.processMarkdown(msg.content));
       }
     }
      // Detectar cambios para actualizar la vista
      this.cdr.detectChanges();
   }

   // Método para procesar el Markdown
   async processMarkdown(content: string): Promise<string> {
     // Retorna una promesa que resuelve en un string
     return this.markdownService.parse(content);
   }
  }
