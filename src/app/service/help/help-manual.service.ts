import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { UrlRoutes } from '../../shared/routes';

@Injectable({
  providedIn: 'root'
})
export class HelpManualService {

  constructor(private http: HttpClient) { }

  downloadManual(): Observable<any> {
    // Mock implementation, assuming UrlRoutes.download_manual is a string URL
    console.log('Downloading manual from:', UrlRoutes.download_manual);
    return of(new Blob());
  }
}
