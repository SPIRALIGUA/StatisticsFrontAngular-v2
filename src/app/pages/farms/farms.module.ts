import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FarmsRoutingModule } from './farms-routing.module';
import { FarmsComponent } from './farms.component';
import { DxDataGridModule, DxTemplateModule,DxBulletModule } from 'devextreme-angular';


@NgModule({
  declarations: [
    FarmsComponent
  ],
  imports: [
    CommonModule,
    FarmsRoutingModule,
    DxDataGridModule,
    DxTemplateModule,
    DxBulletModule,
  ]
})
export class FarmsModule { }
