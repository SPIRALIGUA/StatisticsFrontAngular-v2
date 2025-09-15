import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressbarComponent } from './progressbar.component';
import { SidebarTogglerDirective } from './sidebar-toggler.directive';
import { FullScreenDirective } from './full-screen.directive';
import { RefreshDirective } from './refresh.directive';
import { PageTitleDirective } from './page-title.directive';
import { AlertComponent } from './alert/alert.component';
import { WidgetDirective } from './widget.directive';
import { ConfirmModalComponent } from './confirm-modal.component';
import { ConfirmTemplateDirective } from './confirm-template.directive';
import { MessageTemplateDirective } from './message-template.directive';
import { MessageModalComponent } from './message-modal.component';
import { HeaderTitleDirective, SkinChangerDirective } from './header.directive';

@NgModule({
  declarations: [
    // No declarations here, as all components/directives are standalone
  ],
  imports: [
    CommonModule,
    // Import all standalone components/directives here
    ProgressbarComponent,
    SidebarTogglerDirective,
    FullScreenDirective,
    RefreshDirective,
    PageTitleDirective,
    AlertComponent,
    WidgetDirective,
    ConfirmModalComponent,
    ConfirmTemplateDirective,
    MessageTemplateDirective,
    MessageModalComponent,
    HeaderTitleDirective,
    SkinChangerDirective
  ],
  exports: [
    // Export all standalone components/directives so other modules can use them
    ProgressbarComponent,
    SidebarTogglerDirective,
    FullScreenDirective,
    RefreshDirective,
    PageTitleDirective,
    AlertComponent,
    WidgetDirective,
    ConfirmModalComponent,
    ConfirmTemplateDirective,
    MessageTemplateDirective,
    MessageModalComponent,
    HeaderTitleDirective,
    SkinChangerDirective
  ]
})
export class SharedUtilsModule { }
