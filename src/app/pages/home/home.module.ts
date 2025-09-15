import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from '../home/home.component';
import { SharedUtilsModule } from '@app/shared/shared-utils/shared-utils.module';
import { LayoutModule } from '@app/layout/layout.module';
import { BsModalService } from 'ngx-bootstrap/modal';

@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedUtilsModule,
    LayoutModule    
  ],
  exports:[],
  providers:[]
})
export class HomeModule { }
