import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ruta } from '../rutas';
import { ActividadAlumno, Alumno, InfoAlumno, ModeloOc, Resumen } from '../../admin/pages/admin-dashboard/models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private http: HttpClient = inject(HttpClient)
  private url: string = ruta

  private resumenMesSubject = new BehaviorSubject<Resumen | null>(null)
  resumenMes$ = this.resumenMesSubject.asObservable();
  setResumenMes(resumen: Resumen) {
    this.resumenMesSubject.next(resumen);
  }

  private actividadesSubject = new BehaviorSubject<ActividadAlumno[]>([]);
  actividades$ = this.actividadesSubject.asObservable();
  setActividades(actividades: ActividadAlumno[]) {
    this.actividadesSubject.next(actividades);
  }

  private alumnosSubject = new BehaviorSubject<InfoAlumno | null>(null);
  infoAlumno$ = this.alumnosSubject.asObservable();
  setInfoAlumno(info: InfoAlumno) {
    this.alumnosSubject.next(info);
  }


  traerAlumnos(): Observable<any> {
    if (this.isAppleDevice()) {
      const token = sessionStorage.getItem('token');

      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
      return this.http.get(`${this.url}/admin/alumnos_ayudantes`, { headers })
    }
    return this.http.get(`${this.url}/admin/alumnos_ayudantes`, { withCredentials: true })
  }

  traerResumenMes(): Observable<any> {
    if (this.isAppleDevice()) {
      const token = sessionStorage.getItem('token');

      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
      return this.http.get(`${this.url}/admin/resumen_mes`, { headers })
    }
    return this.http.get(`${this.url}/admin/resumen_mes`, { withCredentials: true })
  }

  traerAdmin(): Observable<any> {
    if (this.isAppleDevice()) {
      const token = sessionStorage.getItem('token');

      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
      return this.http.get(`${this.url}/admin/`, { headers })
    }
    return this.http.get(`${this.url}/admin/`, { withCredentials: true })
  }

  traerDetalleAlumno(run: string): Observable<any> {
    if (this.isAppleDevice()) {
      const token = sessionStorage.getItem('token');

      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
      return this.http.get(`${this.url}/admin/info_alumno/${run}`, { headers })
    }
    return this.http.get(`${this.url}/admin/info_alumno/${run}`, { withCredentials: true })
  }

  traerActividadesAlumno(run: string): Observable<any> {
    if (this.isAppleDevice()) {
      const token = sessionStorage.getItem('token');

      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
      return this.http.get(`${this.url}/admin/actividades_alumno/${run}`, { headers })
    }
    return this.http.get(`${this.url}/admin/actividades_alumno/${run}`, { withCredentials: true })
  }

  registrarOC(run: string, oc: number): Observable<any> {
    if (this.isAppleDevice()) {
      const token = sessionStorage.getItem('token');

      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
      return this.http.post(`${this.url}/admin/registrar_oc`, { run, oc }, { headers })
    }
    return this.http.post(`${this.url}/admin/registrar_oc`, { run, oc }, { withCredentials: true })
  }

  registrarAllOC(dato: ModeloOc[]): Observable<any> {
    if (this.isAppleDevice()) {
      const token = sessionStorage.getItem('token');

      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
      return this.http.post(`${this.url}/admin/registrar_all_oc`, { dato }, { headers })
    }
    return this.http.post(`${this.url}/admin/registrar_all_oc`, { dato }, { withCredentials: true })
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
