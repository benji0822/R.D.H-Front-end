import { Injectable } from '@angular/core';
import Swal from 'sweetalert2'

@Injectable({
  providedIn: 'root'
})
export class MensajeriaService {

  mostrarMensajeExito(mensaje: string) {
    Swal.fire({
      icon: "success",
      text:mensaje,
      showConfirmButton: true
    });
  }

  mostrarMensajeError(mensaje: string) {
    Swal.fire({
      icon: "error",
      text: mensaje,
    });
  }


}
