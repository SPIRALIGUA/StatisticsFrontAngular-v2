import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { SettingsService } from '../core/settings/settings.service';
import { UrlRoutes } from '../shared/routes';

@Injectable({
  providedIn: 'root'
})
export class FarmsService {

  constructor(private client:HttpClient,private setting:SettingsService) { }

  // getFarms(co: boolean) {
  //   const query = `
  //     query QueryFarm($co: Boolean) {
  //       farms(where: { isCo: $co }) {
  //         farm_id
  //         farm_id_colibri
  //         farm_name
  //         farm_short_name
  //       }
  //     }
  //   `;

  //   const variables = {
  //     co: co
  //   };

  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     accept: 'application/json',
  //     Authorization: `Bearer ${this.setting.getUserSetting('tokenGraphQL')}`
  //   });

  //   return this.client.post<any>(UrlRoutes.get_farm_gql, { query, variables }, { headers })
  //     .pipe(map(response => {
  //       return {
  //         data: response.data?.farms,
  //         totalCount: response.data?.farms.length
  //       };
  //     })).toPromise();
  // }
  
}
