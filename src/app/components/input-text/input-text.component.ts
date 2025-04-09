import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'input-text',
  imports: [],
  templateUrl: './input-text.component.html',
  styleUrl: './input-text.component.css'
})
export class InputTextComponent {
  @ViewChild('autosizeTextarea') textarea!: ElementRef<HTMLTextAreaElement>;

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
}
