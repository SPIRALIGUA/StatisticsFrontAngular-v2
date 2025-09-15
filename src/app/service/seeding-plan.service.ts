import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SeedingPlanService {

  constructor() { }

  getExecutedProcesses(): Observable<any> {
    return of({ processes: [] });
  }

  sendInputsToBackend(payload: any): Observable<any> {
    return of({ processId: 'mock-123' });
  }

  getProcessStatus(processId: number): Observable<any> {
    return of({ estado: 'COMPLETADO', mensaje: 'Proceso finalizado con éxito.', descarga: true });
  }
}