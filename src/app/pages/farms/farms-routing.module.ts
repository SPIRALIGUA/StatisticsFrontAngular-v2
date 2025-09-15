import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FarmsComponent } from './farms.component';

const routes: Routes = [{path:'',component:FarmsComponent,data: {breadcrumb: 'Farms'},}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FarmsRoutingModule { }
