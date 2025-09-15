import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalePlanifyComponent } from './sale-planify.component';
import { LayoutModule } from '@app/layout/layout.module';
import { SharedUtilsModule } from '@app/shared/shared-utils/shared-utils.module';
import { SalePlanifyRoutingModule } from './sale-planify-routing.module';
import { FormsModule } from '@angular/forms'; 



@NgModule({
  declarations: [SalePlanifyComponent],
  imports: [
    CommonModule,
    LayoutModule,
    FormsModule,
    SharedUtilsModule,
    SalePlanifyRoutingModule
  ]
})
export class SalePlanifyModule { }
