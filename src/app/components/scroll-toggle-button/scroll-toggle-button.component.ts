import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'scroll-toggle-button',
  imports: [CommonModule],
  templateUrl: './scroll-toggle-button.component.html',
  styles: ``
})
export class ScrollToggleButtonComponent implements OnInit, OnDestroy {
  showScrollButton = false;
  isAtTop = true;

  ngOnInit() {
    window.addEventListener('scroll', this.onScroll, true);
    this.onScroll(); // Verificar estado inicial
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', this.onScroll, true);
  }

  onScroll = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const fullHeight = document.documentElement.scrollHeight;

    this.showScrollButton = fullHeight > windowHeight + 100;
    this.isAtTop = scrollTop < 100;
  };

  handleClick() {
    if (this.isAtTop) {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
