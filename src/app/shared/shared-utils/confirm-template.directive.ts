import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[appConfirmTemplate]',
  standalone: true
})
export class ConfirmTemplateDirective {
  constructor(public templateRef: TemplateRef<any>) {}
}
