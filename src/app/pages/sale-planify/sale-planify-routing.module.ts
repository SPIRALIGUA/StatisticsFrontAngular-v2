import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SalePlanifyComponent } from './sale-planify.component';

const routes: Routes = [
  {
    path: '',
    component: SalePlanifyComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalePlanifyRoutingModule {}
