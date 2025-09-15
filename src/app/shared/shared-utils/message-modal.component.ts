import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-message-modal',
  template: `
    <div *ngIf="visible" class="modal">
      <div class="modal-content">
        <h4>{{ title }}</h4>
        <p [innerHTML]="message"></p>
        <button (click)="close.emit()">Close</button>
      </div>
    </div>
  `,
  standalone: true,
  imports: [CommonModule]
})
export class MessageModalComponent {
  @Input() title: string = '';
  @Input() message: string = '';
  @Input() visible: boolean = false;
  @Output() close = new EventEmitter<void>();
}
