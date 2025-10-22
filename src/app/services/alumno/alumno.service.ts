import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HorasArea } from '../../alumno/pages/alumno-dashboard/models/interfaces';
import { ruta } from '../rutas';

@Injectable({
  providedIn: 'root'
})
export class AlumnoService {

  private http: HttpClient = inject(HttpClient)
  private url: string = ruta

  private horasAreaMesSubject = new BehaviorSubject<HorasArea[]>([])
  horasAreaMes$ = this.horasAreaMesSubject.asObservable()
  setHorasAreaMes(horasAreaMes: HorasArea[]) {
    this.horasAreaMesSubject.next(horasAreaMes)
  }

  private OCSubject = new BehaviorSubject<number>(0)
  OC$ = this.OCSubject.asObservable()
  setOC(oc: number) {
    this.OCSubject.next(oc)
  }



  traerResumenMes(): Observable<any> {
    if (this.isAppleDevice()) {
      const token = sessionStorage.getItem('token');
      

      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
      return this.http.get(`${this.url}/alumno/total_mes`, {headers})
    }
    return this.http.get(`${this.url}/alumno/total_mes`, { withCredentials: true })
  }

  traerActividadesMes(): Observable<any> {
    if (this.isAppleDevice()) {
      const token = sessionStorage.getItem('token');
      

      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
      return this.http.get(`${this.url}/alumno/actividades_mes`, { headers })
    }
    return this.http.get(`${this.url}/alumno/actividades_mes`, { withCredentials: true })
  }

  traerAreas(): Observable<any> {
    if (this.isAppleDevice()) {
      const token = sessionStorage.getItem('token');
      

      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
      return this.http.get(`${this.url}/area_trabajo/`, { headers })
    }
    return this.http.get(`${this.url}/area_trabajo/`, { withCredentials: true })
  }

  traerHorasAreasMes(): Observable<any> {
    if (this.isAppleDevice()) {
      const token = sessionStorage.getItem('token');
      

      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
      return this.http.get(`${this.url}/alumno/horas_area_actual`, { headers })
    }
    return this.http.get(`${this.url}/alumno/horas_area_actual`, { withCredentials: true })
  }

  obtenerOC():Observable<any>{
    if (this.isAppleDevice()) {
      const token = sessionStorage.getItem('token');
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
      return this.http.get(`${this.url}/alumno/traer_oc`,{headers})
    }
    return this.http.get(`${this.url}/alumno/traer_oc`,{withCredentials:true})
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
