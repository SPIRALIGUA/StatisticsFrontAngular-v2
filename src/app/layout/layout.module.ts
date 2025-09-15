import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgSlimScrollModule } from 'ngx-slimscroll';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { NavigationComponent } from './navigation/navigation.component';
import { SideBarComponent } from './side-bar/side-bar.component';
import { SkeletonComponent } from './skeleton/skeleton.component';

@NgModule({
  declarations: [BreadcrumbComponent, NavigationComponent, SideBarComponent, SkeletonComponent],
  imports: [
    CommonModule,
    RouterModule,
    NgSlimScrollModule
  ],
  exports: [BreadcrumbComponent, NavigationComponent, SideBarComponent, SkeletonComponent]
})
export class LayoutModule { }
