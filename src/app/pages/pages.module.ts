import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesRoutingModule } from './pages.routing';
import { LayoutModule } from '../layout/layout.module';
import { SharedUtilsModule } from '../shared/shared-utils/shared-utils.module';

// Import the feature modules instead of declaring their components
import { FarmsModule } from './farms/farms.module';
import { HomeModule } from './home/home.module';
import { SalePlanifyModule } from './sale-planify/sale-planify.module';
import { CarnationToolModule } from './carnation-tool/carnation-tool.module';
import { HelpPageModule } from './help-page/help-page.module';

@NgModule({
  declarations: [
    // No component declarations here, as they are in their own modules
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    SharedUtilsModule,
    LayoutModule, // This might also need to be checked if it's a standalone component or module
    FarmsModule,
    HomeModule,
    SalePlanifyModule,
    CarnationToolModule,
    HelpPageModule
  ],
  providers: []
})
export class PagesModule { }

