import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarnationToolComponent } from './carnation-tool.component';
import { LayoutModule } from '@app/layout/layout.module';
import { SharedUtilsModule } from '@app/shared/shared-utils/shared-utils.module';
import { CarnationToolRoutingModule } from './carnation-tool-routing.module';
import { FormsModule } from '@angular/forms';
import { ConfirmService } from '@app/shared/shared-utils/message.component';


@NgModule({
  declarations: [CarnationToolComponent],
  imports: [
    CommonModule,
    CarnationToolRoutingModule,
    LayoutModule,
    SharedUtilsModule,
    FormsModule
   

  ],
  providers: [ConfirmService]
})
export class CarnationToolModule { }
  