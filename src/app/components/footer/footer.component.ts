import { Component } from '@angular/core';

@Component({
  selector: 'footer-page',
  imports: [],
  templateUrl: './footer.component.html',
  styles: ``
})
export class FooterComponent {
  currentYear: number = new Date().getFullYear();
  author: string = 'Leo Ss';

  phrases = [
    'Made with ❤',
    'Powered by purrs and creativity 🐈',
    'Developed with ❤️ and ☕',
    'Coded under strict supervision of my cat 🐾 ',
    'Just another line of code </>...',
    'Programming with a cat on my lap 🐾',
    'Dreamed, built, and shipped 🚀',
    'Fueled by coffee and paw-sitive vibes 🐾'
  ];

  selectedPhrase: string = this.phrases[Math.floor(Math.random() * this.phrases.length)];

}
