import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CarnationToolComponent } from './carnation-tool.component';


const routes: Routes = [
  {
    path: '',
    component: CarnationToolComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CarnationToolRoutingModule {}
