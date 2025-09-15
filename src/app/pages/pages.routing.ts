import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagesComponent } from './pages.component';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    { path: 'home', loadChildren: () => import('./home/home.module').then(x => x.HomeModule) },
    { path: 'SalePlanify', loadChildren: () => import('./sale-planify/sale-planify.module').then(x => x.SalePlanifyModule) },
    { path: 'farms', loadChildren: () => import('./farms/farms.module').then((x) => x.FarmsModule) }, 
    { path: 'carnationtool', loadChildren: () => import('./carnation-tool/carnation-tool.module').then((x) => x.CarnationToolModule) }, 
    { path: 'Help', loadChildren: () => import('./help-page/help-page.module').then((x) => x.HelpPageModule) },
    { path: '', redirectTo: '/home', pathMatch: 'full' }
  ]
}]; // sets up routes constant where you define your routes

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class PagesRoutingModule { }
