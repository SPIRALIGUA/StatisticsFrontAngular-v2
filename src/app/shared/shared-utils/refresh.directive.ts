import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appRefresh]',
  standalone: true
})
export class RefreshDirective {
  @HostListener('click', ['$event'])
  onClick(event: any) {
    event.preventDefault();
    // Add refresh logic here, e.g., location.reload();
    location.reload();
  }
}
