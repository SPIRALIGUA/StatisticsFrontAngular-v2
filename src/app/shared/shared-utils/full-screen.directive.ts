import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appFullScreen]',
  standalone: true
})
export class FullScreenDirective {
  @HostListener('click', ['$event'])
  onClick(event: any) {
    event.preventDefault();
    const elem = document.documentElement;
    if (!document.fullscreenElement) {
      elem.requestFullscreen().catch(err => {
        alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    } else {
      document.exitFullscreen();
    }
  }
}
