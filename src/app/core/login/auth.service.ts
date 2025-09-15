import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '@app/models/user';
import { UrlRoutes } from '@app/shared/routes';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  getApiToken(username:string,password:string):Observable<any>{
    return this.http.post(environment.urlApi + UrlRoutes.login,{username:username,password:password});
  }

  getApipythonToken(username:string,password:string):Observable<any>{
    return this.http.post(environment.urlPythonApi + UrlRoutes.loginPython,{username:username,password:password});
  }

  getGraphQLToken(username:string,password:string):Observable<any>{
    return this.http.post(environment.urlGraphQL + UrlRoutes.loginGraphQL,{username:username,password:password});
  }

  getUserContext(key:string):Observable<User>{
    return this.http.get<User>(environment.urlApi + UrlRoutes.userContext + key);
  }

}
