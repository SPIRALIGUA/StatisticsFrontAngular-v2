import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appWidget]',
  standalone: true
})
export class WidgetDirective implements OnInit {
  @Input() appWidget: any;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    // Basic widget logic, can be expanded
    this.el.nativeElement.style.border = '1px solid #eee';
    this.el.nativeElement.style.padding = '15px';
    this.el.nativeElement.style.marginBottom = '20px';
  }
}