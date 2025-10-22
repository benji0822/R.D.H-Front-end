import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AreaTrabajo } from '../models/interfaces';
import { ruta } from './rutas';

@Injectable({
  providedIn: 'root'
})
export class AreaTrabajoService {
  private http = inject(HttpClient)
  private url = ruta

  private areasTrabajoSubject = new BehaviorSubject<AreaTrabajo[]>([])
  areasTrabajo$ = this.areasTrabajoSubject.asObservable()

  setareasTrabajo(areasTrabajo:AreaTrabajo[]){
    this.areasTrabajoSubject.next(areasTrabajo)
  }

  traerAreasTrabajo():Observable<any>{
    if (this.isAppleDevice()) {
      const token = sessionStorage.getItem('token');

      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
      return this.http.get(`${this.url}/area_trabajo/`,{headers})
    }
    return this.http.get(`${this.url}/area_trabajo/`,{withCredentials:true})
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
