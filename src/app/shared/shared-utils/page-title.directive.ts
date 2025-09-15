import { Directive, ElementRef } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Directive({
  selector: '[appPageTitle]',
  standalone: true
})
export class PageTitleDirective {
  constructor(private el: ElementRef, private titleService: Title) {
    const title = this.el.nativeElement.innerText;
    this.titleService.setTitle(title);
  }
}
