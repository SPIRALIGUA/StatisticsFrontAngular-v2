import { NgModule, Optional, SkipSelf } from '@angular/core';

import { SettingsService } from './settings/settings.service';
import { ThemesService } from './themes/themes.service';
import { TranslatorService } from './translator/translator.service';
import { MenuService } from './menu/menu.service';

import { throwIfAlreadyLoaded } from './module-import-guard';
import { LoginComponent } from './login/login.component';
import { AuthService } from './login/auth.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@NgModule({
    imports: [RouterModule.forChild([]), CommonModule],
    providers: [
        SettingsService,
        ThemesService,
        TranslatorService,
        MenuService,
        AuthService
    ],
    declarations: [
      LoginComponent
    ],
    exports: [
      LoginComponent
    ]
})
export class CoreModule {
    constructor( @Optional() @SkipSelf() parentModule: CoreModule) {
        throwIfAlreadyLoaded(parentModule, 'CoreModule');
    }
}
