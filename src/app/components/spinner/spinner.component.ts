import { Component } from '@angular/core';

@Component({
  selector: 'spinner',
  imports: [],
  templateUrl: './spinner.component.html',
  styles: `
    .loader {
      width: 60px;
      aspect-ratio: 4;
      --c:#d1d5dc 80%, #0000;
      background:
        radial-gradient(circle closest-side at left  6px top 50%, var(--c)),
        radial-gradient(circle closest-side, var(--c)),
        radial-gradient(circle closest-side at right 6px top 50%, var(--c));
      background-size: 100% 100%;
      background-repeat: no-repeat;
      animation: l4 1s infinite alternate;
    }
    @keyframes l4 {
        to{width:25px;aspect-ratio: 1}
    }
  `
})
export class SpinnerComponent {

}
