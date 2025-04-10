import { CommonModule, NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ChatMessage } from '../../interfaces/chat-message';


@Component({
  selector: 'chat',
  imports: [CommonModule, NgClass],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})

export class ChatComponent {
   @Input() messages: { from: string, content: string }[] = [];

  }
