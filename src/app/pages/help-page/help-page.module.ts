import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HelpPageRoutingModule } from './help-page-routing.module';
import { HelpPageComponent } from './help-page.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { DevExtremeModule } from "devextreme-angular";


@NgModule({
  declarations: [
    HelpPageComponent
  ],
  imports: [
    CommonModule,
    HelpPageRoutingModule,
    PdfViewerModule,
    DevExtremeModule
  ]
})
export class HelpPageModule { }
