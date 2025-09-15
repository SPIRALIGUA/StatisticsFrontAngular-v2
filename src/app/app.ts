import { Component, signal } from '@angular/core';
import { ConfirmModalComponent } from './shared/shared-utils/confirm-modal.component';
import { MessageModalComponent } from './shared/shared-utils/message-modal.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: true,
  styleUrl: './app.css',
  imports: [
    RouterOutlet,
    ConfirmModalComponent,
    MessageModalComponent
  ]
})
export class App {
  protected readonly title = signal('StatisticsFrontAngular-v2');
}
