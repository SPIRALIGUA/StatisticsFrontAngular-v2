import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '@app/service/common.service';
import { MenuService } from '../menu/menu.service';
import { SettingsService } from '../settings/settings.service';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers:[AuthService],
  standalone: false
})
export class LoginComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private auth:AuthService,
    private setting:SettingsService,
    private menu:MenuService,
    private rt: Router,
    private common:CommonService
    ) { }
    
    ngOnInit(): void {

      const usernamePython = environment.user_python_api
      const passwordPython = environment.password_python_api
      const usernameGraphQL = environment.user_graphql_api
      const passwordGraphQL = environment.password_graphql_api
      const routeParams = this.route.snapshot.queryParamMap;
      const keyLogin = routeParams.get('keyLogin');
      
      
      if(keyLogin == null || keyLogin == '') this.common.redirecToUnauthorized({code:'401',error:'Token',message:'Token no valido'})
      
        this.auth.getApipythonToken(usernamePython, passwordPython).subscribe((x: any) => {
          if (x.token_type === 'bearer') {
            this.setting.setUserSetting('tokenPython', x.access_token);
          } else {
            this.common.redirecToError({ code: '404', error: 'Not found', message: 'No se pudo obtener el token Python' });
          }
        });

        this.auth.getGraphQLToken(usernameGraphQL, passwordGraphQL).subscribe({
          next: (x: any) => {
            if (x.token) {
              this.setting.setUserSetting('tokenGraphQL', x.token);
            } else {
              this.common.redirecToError({
                code: '404',
                error: 'Not found',
                message: 'No se pudo obtener el token GraphQL'
              });
            }
          },
          error: (err) => {
            console.error('Error al obtener el token', err);
            this.common.redirecToError({
              code: '500',
              error: 'Internal Server Error',
              message: 'Error al comunicarse con el servicio de autenticación'
            });
          }
        });

        this.auth.getUserContext(keyLogin??'').subscribe((x:any)=>{
        if(x.typeResult == 1){
          const user = x.objectResult[0];
          Object.keys(user).forEach(y=>{
            this.setting.setUserSetting(y,user[y]);
          });
          this.setting.setUserSetting('token',x.messageResult);
           // Find the product that correspond with the id provided in route.         
          this.menu.getMenu();
          this.menu.getPermission();
          this.rt.navigate(['']);
        }else{
          this.common.redirecToError({code:'404',error:'Not found',message:'usuario no encontrado'})
        }
      });
    }  
}
