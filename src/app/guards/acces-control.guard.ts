import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
//import { of } from 'rxjs/operator';
import { SettingsService } from '../core/settings/settings.service';
import { User } from '../models/user';
import { CommonService } from '../service/common.service';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class AccesControlGuard implements CanActivate, CanActivateChild {
  constructor(public setting: SettingsService, public common: CommonService) {

  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const user: User = this.setting.getUserSetting('');
    if (user.userId != null && user.userId != '') {
      const dateEnd = moment(user.dateEnd, 'MM/DD/YYYY hh:mm:ss').toDate();
      if (moment(dateEnd).isValid() && dateEnd < new Date()) {
        this.common.borrarElementoSession("colibri_usr");
        this.common.borrarElementoSession("permission_menu");
        return this.common.redirecToError({ error: 'Credencial', code: '400', message: 'Credenciales vencidas vuelva a hacer login' });
      }
      return of(true)
    }
    else
                  return this.common.redirecToUnauthorized({ error: 'No autorizado', code: '401', message: 'Usuario no autorizado' }).then((x: any) => false);


  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const permission = this.common.obtenerElementoSession('permission_menu');
    let _return = false;
    if (permission.length > 0) {

      Object.keys(permission).forEach(y => {
        if (state.url.includes('/' + permission[y]['controller'] + '/' + permission[y]['action'])) {
          _return = true;
        }
      });
    }
    if (_return) {
      return of(true)
    } else {
      return this.common.redirecToUnauthorized({ error: 'No autorizado', code: '401', message: 'Usuario no autorizado' }).then(x => false);
    }
  }

}
