import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private router: Router) { }

  borrarElementoSession(key: string): void {
    // Mock
  }

  redirecToError(error: any): Promise<boolean> {
    this.router.navigate(['/error']);
    return Promise.resolve(false);
  }

  redirecToNoFound(error: any): Promise<boolean> {
    this.router.navigate(['/not-found']);
    return Promise.resolve(false);
  }

  obtenerElementoSession(key: string): string | null {
    return null;
  }

  redirecToUnauthorized(error: any): Promise<boolean> {
    this.router.navigate(['/unauthorized']);
    return Promise.resolve(false);
  }

  showLoading(): void {}

  hideLoading(): void {}

  showNotification(type: string, title: string, message: string): void {}
}
