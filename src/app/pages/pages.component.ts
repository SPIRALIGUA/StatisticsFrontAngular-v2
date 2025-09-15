import { Component } from '@angular/core';
import { locale } from "devextreme/localization";
@Component({
  selector: 'app-pages',
  template: `<app-skeleton></app-skeleton>`
})
export class PagesComponent {
  public constructor() {
    locale(navigator.language);
  }
}
