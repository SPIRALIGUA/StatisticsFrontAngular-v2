import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appSidebarToggler]',
  standalone: true
})
export class SidebarTogglerDirective {
  @HostListener('click', ['$event'])
  onClick(event: any) {
    event.preventDefault();
    document.body.classList.toggle('sidebar-toggled');
  }
}
