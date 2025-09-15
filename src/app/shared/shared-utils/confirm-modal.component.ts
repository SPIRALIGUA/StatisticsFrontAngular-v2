import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-modal',
  template: `
    <div *ngIf="visible" class="modal">
      <div class="modal-content">
        <h4>{{ title }}</h4>
        <p>{{ message }}</p>
        <button (click)="confirm.emit()">Confirm</button>
        <button (click)="cancel.emit()">Cancel</button>
      </div>
    </div>
  `,
  standalone: true,
  imports: [CommonModule]
})
export class ConfirmModalComponent {
  @Input() title: string = '';
  @Input() message: string = '';
  @Input() visible: boolean = false;
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
}
