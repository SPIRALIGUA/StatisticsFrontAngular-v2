import { HttpErrorResponse, HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import { User } from '@app/models/user';
import { CommonService } from '@app/service/common.service';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService {

  constructor(private common:CommonService,private router: Router) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const user: User = this.common.obtenerElementoSession("colibri_usr");
    let request = req;
    if (JSON.stringify(user) !='{}') {
      request = req.clone();
    }

    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {

        if (err.status === 401) {
          this.common.redirecToUnauthorized({code:"401",error:'No autorizado',message:"El token ha caducado o esta intentando acceder a una zona no autorizada"});
        }else if(err.status === 503 || err.status === 0){
          this.common.redirecToError({code:"503",error:'Error',message:"Servicio no disponible"});
        }else if(err.status === 400){
          this.common.redirecToError({code:"400",error:'Credenciales',message:"Credenciales vencidas vuelva a hacer login"});
        }
        return throwError(()=> err );

      })
    );;
  }
}
