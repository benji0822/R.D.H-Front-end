import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { ruta } from './rutas';
import { MensajeriaService } from './mensajeria.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private http = inject(HttpClient)
  private mensajeriaService = inject(MensajeriaService)
  private localUrl = ruta


  findUserbyEmail(): Observable<any> {
    if (this.isAppleDevice()) {
      const token = sessionStorage.getItem('token');

      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
      return this.http.get(`${this.localUrl}/usuario/`, { headers })

    }
    return this.http.get(`${this.localUrl}/usuario/`, { withCredentials: true })
  }

  actualizarDatos(valores: any): Observable<any> {
    return this.http.put(`${this.localUrl}/usuario/update`, { newPassword: valores }, { withCredentials: true })
  }

  validarPerfilForm(perfilForm: FormGroup): boolean {

    //validar campos vacios
    if (perfilForm.get('newPassword')?.hasError('required')) {
      this.mensajeriaService.mostrarMensajeError('La contraseña es obligatoria')
      return false
    }
    if (perfilForm.get('newPassword2')?.hasError('required')) {
      this.mensajeriaService.mostrarMensajeError('Es necesario repetir la contraseña')
      return false
    }
    if (perfilForm.get('newPassword')?.hasError('minlength')) {
      this.mensajeriaService.mostrarMensajeError('La contraseña debe tener al menos 8 caracteres')
      return false
    }
    if (perfilForm.get('newPassword')?.hasError('maxlength')) {
      this.mensajeriaService.mostrarMensajeError('La contraseña no puede tener mas de 50 caracteres')
      return false
    }
    if (perfilForm.get('newPassword2')?.hasError('minlength')) {
      this.mensajeriaService.mostrarMensajeError('La contraseña debe tener al menos 8 caracteres')
      return false
    }
    if (perfilForm.get('newPassword2')?.hasError('maxlength')) {
      this.mensajeriaService.mostrarMensajeError('La contraseña no puede tener mas de 50 caracteres')
      return false
    }
    if (perfilForm.get('newPassword')?.hasError('pattern')) {
      this.mensajeriaService.mostrarMensajeError('La contraseña debe tener al menos una mayúscula, una minúscula, un número y un carácter especial')
      return false
    }
    if (perfilForm.get('newPassword2')?.hasError('pattern')) {
      this.mensajeriaService.mostrarMensajeError('La contraseña debe tener al menos una mayúscula, una minúscula, un número y un carácter especial')
      return false
    }

    //verificar que ambas contras sean iguales
    if (perfilForm.get('newPassword')?.value !== perfilForm.get('newPassword2')?.value) {
      this.mensajeriaService.mostrarMensajeError('Las contraseñas no coinciden')
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

