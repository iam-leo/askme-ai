import { CommonModule, NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ChatMessage } from '../../interfaces/chat-message';
import { SpinnerComponent } from '../spinner/spinner.component';


@Component({
  selector: 'chat',
  imports: [CommonModule, NgClass, SpinnerComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})

export class ChatComponent {
   @Input() messages: { from: string, content: string }[] = [];
   @Input() isThinking: boolean = false;

  }
