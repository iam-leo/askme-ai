import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { InputTextComponent } from "./components/input-text/input-text.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, InputTextComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'askme-ai';
}
