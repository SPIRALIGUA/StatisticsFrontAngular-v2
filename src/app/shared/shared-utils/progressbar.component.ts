import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-progressbar',
  template: `
    <div class="progress">
      <div class="progress-bar" role="progressbar" [style.width.%]="value"></div>
    </div>
  `,
  standalone: true,
  imports: [CommonModule]
})
export class ProgressbarComponent {
  @Input() value: number = 0;
}
