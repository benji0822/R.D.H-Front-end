import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ruta } from '../rutas';
import { Solicitud } from '../../admin/pages/admin-dashboard/models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class SolicitudService {

  private http = inject(HttpClient)
  private url = ruta

  private solicitudSubject = new BehaviorSubject<Solicitud[]>([])
  solicitud$ = this.solicitudSubject.asObservable()
  setSolicitud(solicitud: Solicitud[]) {
    this.solicitudSubject.next(solicitud)
  }


  private allSolicitudesSubject = new BehaviorSubject<Solicitud[]>([])
  allSolicitudes$ = this.allSolicitudesSubject.asObservable()
  setAllSolicitudes(solicitudes: Solicitud[]) {
    this.allSolicitudesSubject.next(solicitudes)
  }


  traerSolicitudesMes(): Observable<any> {
    if (this.isAppleDevice()) {
      const token = sessionStorage.getItem('token');
      

      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
      return this.http.get(`${this.url}/admin/solicitudes_mes`, { headers })
    }
    return this.http.get(`${this.url}/admin/solicitudes_mes`, { withCredentials: true })
  }

  traerSolicitudes(): Observable<any> {
    if (this.isAppleDevice()) {
      const token = sessionStorage.getItem('token');
      

      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
      return this.http.get(`${this.url}/admin/solicitudes`, { headers })
    }
    return this.http.get(`${this.url}/admin/solicitudes`, { withCredentials: true })
  }

  aprobarSolicitud(id: number): Observable<any> {
    if (this.isAppleDevice()) {
      const token = sessionStorage.getItem('token');
      

      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
      return this.http.put(`${this.url}/admin/actualizar_solicitud/${id}`, {}, { headers })
    }
    return this.http.put(`${this.url}/admin/actualizar_solicitud/${id}`, {}, { withCredentials: true })
  }

  traerSolicitudId(id: number): Observable<any> {
    if (this.isAppleDevice()) {
      const token = sessionStorage.getItem('token');
      

      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
      return this.http.get(`${this.url}/admin/solicitud/${id}`, { headers })
    }
    return this.http.get(`${this.url}/admin/solicitud/${id}`, { withCredentials: true })
  }

  notificarRechazoSolicitud(): Observable<any> {
    if (this.isAppleDevice()) {
      const token = sessionStorage.getItem('token');
      

      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
      return this.http.get(`${this.url}/admin/notificar_rechazo`, { headers })
    }
    return this.http.get(`${this.url}/admin/notificar_rechazo`, { withCredentials: true })
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
