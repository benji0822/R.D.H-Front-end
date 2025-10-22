import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Actividad,DetallesAlumno } from '../../models/interfaces';
import { FormGroup } from '@angular/forms';
import { ruta } from '../rutas';
import { MensajeriaService } from '../mensajeria.service';
import { HorasArea, ResumenMes } from '../../alumno/pages/alumno-dashboard/models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ActividadService {

  private http = inject(HttpClient)
  private url = ruta
  private mensajeriaService = inject(MensajeriaService)

  private actividadesSubject = new BehaviorSubject<Actividad[]>([])
  actividades$ = this.actividadesSubject.asObservable()
  setActvidades(nuevasActividades: Actividad[]) {
    this.actividadesSubject.next(nuevasActividades)
  }

  private resumenMesSubject = new BehaviorSubject<ResumenMes | null>(null)
  resumenMes$ = this.resumenMesSubject.asObservable()
  setResumenMes(resumenMes:ResumenMes){
    this.resumenMesSubject.next(resumenMes)
  }

  private HorasFiltradasSubject = new BehaviorSubject<HorasArea[]>([])
  horasFiltradas$ = this.HorasFiltradasSubject.asObservable()
  setHorasFiltradas(horasFiltradas: HorasArea[]) {
    this.HorasFiltradasSubject.next(horasFiltradas)
  }


  registrarActividad(actividad: any): Observable<any> {
    if (this.isAppleDevice()) {
      const token = sessionStorage.getItem('token');
      

      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
      return this.http.post(`${this.url}/alumno/registrar_actividad`,actividad ,{ headers })
    }
    return this.http.post(`${this.url}/alumno/registrar_actividad`, actividad, { withCredentials: true })
  }

  traerTotalesAlumno(): Observable<any> {
    if (this.isAppleDevice()) {
      const token = sessionStorage.getItem('token');
      

      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
      return this.http.get(`${this.url}/actividad/totales_alumno`, { headers })
    }
    return this.http.get(`${this.url}/actividad/totales_alumno`, { withCredentials: true })
  }

  traerHorasFiltradas(mesYanio: number | null = null): Observable<any> {
     if (this.isAppleDevice()) {
      const token = sessionStorage.getItem('token');
      

      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
      return this.http.get(`${this.url}/alumno/horas_area_mes/${mesYanio}`, { headers })
    }
    return this.http.get(`${this.url}/alumno/horas_area_mes/${mesYanio}`, { withCredentials: true })
  }

  traerActividadesFiltradas(mesYanio: number | undefined, area: number | undefined): Observable<any> {
    let params: any = {}
    if (mesYanio) {
      params.mesYanio = mesYanio
    }
    if (area) {
      params.area = area
    }
    if (this.isAppleDevice()) {
      const token = sessionStorage.getItem('token');
      

      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });

      return this.http.get(`${this.url}/alumno/actividades_area_mes`,{params, headers })
    }
    return this.http.get(`${this.url}/alumno/actividades_area_mes`, { params, withCredentials: true })
  }

  validarActividad(actividadForm: FormGroup): boolean {

    //validar que no esten vacios
    if (actividadForm.get('fecha')?.hasError('required')) {
      this.mensajeriaService.mostrarMensajeError('Fecha requerida!')
      return false
    }
    if (actividadForm.get('horaInic')?.hasError('required')) {
      this.mensajeriaService.mostrarMensajeError('Hora de inicio requerida!')
      return false
    }
    if (actividadForm.get('horaTerm')?.hasError('required')) {
      this.mensajeriaService.mostrarMensajeError('Hora de termino requerida!')
      return false
    }
    if (actividadForm.get('area')?.hasError('required')) {
      this.mensajeriaService.mostrarMensajeError('Area de trabajo requerida!')
      return false
    }

    //validar año de actividad
    const date = new Date(actividadForm.get('fecha')?.value)

    if(date.getFullYear() < new Date().getFullYear() || date.getFullYear() > new Date().getFullYear() ){
      this.mensajeriaService.mostrarMensajeError('El año del registro debe ser el actual')
      return false
    }

    //validar horas validas!
    const horaInic: string = actividadForm.get('horaInic')?.value
    const horaTerm: string = actividadForm.get('horaTerm')?.value

    //validar que la hora de inicio sea menor a la de termino
    const [hora1, minutos1] = horaInic.split(':').map(Number)
    const minutosInic: number = hora1 * 60 + minutos1

    const [hora2, minutos2] = horaTerm.split(':').map(Number)
    const minutosTerm: number = hora2 * 60 + minutos2

    if (minutosInic > minutosTerm) {
      this.mensajeriaService.mostrarMensajeError('La hora de inicio no puede ser mayor a la de termino!')
      return false
    }

    //validar que las horas ingresadas esten dentro de 6 am y 11:30 pm
    const inicioPermitido = 6 * 60
    const finPermitido = 23 * 60 + 30
    if (minutosInic < inicioPermitido || minutosInic > finPermitido) {
      this.mensajeriaService.mostrarMensajeError('Hora de inicio fuera de rango permitido!')
      return false
    }

    if (minutosTerm < inicioPermitido || minutosTerm > finPermitido) {
      this.mensajeriaService.mostrarMensajeError('Hora de termino no permitida!')
      return false
    }
    return true
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
