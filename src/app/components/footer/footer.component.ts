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

}
