import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'input-text',
  imports: [FormsModule],
  templateUrl: './input-text.component.html',
  styleUrl: './input-text.component.css'
})
export class InputTextComponent {
  @ViewChild('autosizeTextarea') textarea!: ElementRef<HTMLTextAreaElement>;
  @Output() newMessage = new EventEmitter<string>();
  @Input() showPlaceholder: boolean = true;

  userInput = '';

  autoResizeTextArea(): void {
    const el = this.textarea.nativeElement;

    el.style.height = 'auto'; // Reinicia altura para recálculo
    const maxHeight = 6 * 16; // 6rem = 96px = altura de 4 líneas (16px por línea en text-sm aprox)

    if (el.scrollHeight <= maxHeight) {
      el.style.overflowY = 'hidden';
      el.style.height = `${el.scrollHeight}px`;
    } else {
      el.style.overflowY = 'auto';
      el.style.height = `${maxHeight}px`;
    }
  }

  // Emitir el mensaje del usuario al componente padre (app.component)
  sendMessage() {
    const message = this.userInput.trim();
    if (message) {
      this.newMessage.emit(message);
      this.userInput = '';

       // Resetear altura del textarea
      const textareaEl = this.textarea.nativeElement;
      textareaEl.style.height = 'auto'; // Reinicia la altura
    }
  }
}
