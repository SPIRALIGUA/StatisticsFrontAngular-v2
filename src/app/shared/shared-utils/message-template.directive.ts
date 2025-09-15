import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[appMessageTemplate]',
  standalone: true
})
export class MessageTemplateDirective {
  constructor(public templateRef: TemplateRef<any>) {}
}
