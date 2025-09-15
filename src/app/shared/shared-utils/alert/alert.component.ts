import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-alert',
  template: `
    <div *ngIf="visible" class="alert">
      <p>{{ message }}</p>
      <button (click)="close.emit()">Close</button>
    </div>
  `,
  standalone: true
})
export class AlertComponent {
  @Input() message: string = '';
  @Input() visible: boolean = false;
  @Output() close = new EventEmitter<void>();
}
