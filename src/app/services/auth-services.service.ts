import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ruta } from './rutas';

@Injectable({
  providedIn: 'root'
})
export class AuthServicesService {
  //servicios
  private router: Router = new Router()

  private http = inject(HttpClient)
  private localUrl = ruta

  login(valores: any): Observable<any> {
    return this.http.post(`${this.localUrl}/auth/login`, valores, { withCredentials: true })
  }

  logout(): Observable<any> {
    if( this.isAppleDevice()) {
      sessionStorage.removeItem('token');
      return this.http.post(`${this.localUrl}/auth/logout`, {}, { withCredentials: true })
    }
    return this.http.post(`${this.localUrl}/auth/logout`, {}, { withCredentials: true })
  }

  recuperarClave(email: string): Observable<any> {
    return this.http.put(`${this.localUrl}/auth/forgot_password`, { email: email })
  }

  isAuthenticated(): Observable<any> {
    if (this.isAppleDevice()) {
      const token = sessionStorage.getItem('token');

      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
      return this.http.get(`${this.localUrl}/auth/is_authenticated`, { headers })
    }
    return this.http.get(`${this.localUrl}/auth/is_authenticated`, { withCredentials: true })
  }

  goToLogin() {
    this.router.navigate(['login'])
  }

  isAppleDevice(): boolean {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    const platform = navigator.platform;

    // iPhone, iPad, iPod
    const isIOS = /iPhone|iPad|iPod/.test(userAgent);

    // iPadOS 13+ en modo escritorio (se identifica como Mac)
    const isIPadOS13Plus = platform === 'MacIntel' && navigator.maxTouchPoints > 1;

    // Macs reales (MacBook, iMac, etc.)
    const isMac = /Macintosh/.test(platform || userAgent);

    return isIOS || isIPadOS13Plus || isMac;
  }

}
