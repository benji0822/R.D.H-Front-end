import { Component, inject, OnInit } from '@angular/core';
import { GeneralModule } from '../../../../../shared/modules/general/general.module';
import Swal from 'sweetalert2';
import { SolicitudService } from '../../../../../services/admin/solicitud.service';
import { MensajeriaService } from '../../../../../services/mensajeria.service';
import { Solicitud, SolicitudAlumno } from '../../models/interfaces';

@Component({
  selector: 'app-solicitudes',
  imports: [GeneralModule],
  templateUrl: './solicitudes.component.html',
  styleUrl: './solicitudes.component.css'
})
export class SolicitudesComponent implements OnInit {
  // servicios
  private solicitudService = inject(SolicitudService)
  private mensajeriaService = inject(MensajeriaService)

  solicitudes: Solicitud[] = []
  allSolicitudes: Solicitud[] = []

  nombreApellido: string = ''
  fechaActividad: string = ''
  horaInicio: any
  horaTermino: string = ''
  cantidadHoras: any
  areaTrabajo: any

  ngOnInit() {
    this.traerSolicitudes()
    this.traerTodasSolicitudes()
    this.solicitudService.solicitud$.subscribe((solicitudes) => {
      this.solicitudes = solicitudes
    })
    this.solicitudService.allSolicitudes$.subscribe((solicitudes) => {
      this.allSolicitudes = solicitudes
    })
  }

  private traerSolicitudes() {
    this.solicitudService.traerSolicitudesMes().subscribe({
      next: (response: { solicitudes: Solicitud[] }) => {
        this.solicitudService.setSolicitud(response.solicitudes)
      },
      error: (err: any) => {
        this.mensajeriaService.mostrarMensajeError('Error al cargar las solicitudes del mes')
      }
    })
  }

  confirmarActualizacion(id: number) {

    this.solicitudService.traerSolicitudId(id).subscribe({
      next: async (response: { solicitud: SolicitudAlumno }) => {
        this.nombreApellido = response.solicitud.nombre
        this.fechaActividad = response.solicitud.fecha
        this.horaInicio = response.solicitud.inicio
        this.horaTermino = response.solicitud.fin
        this.areaTrabajo = response.solicitud.area

        const result = await Swal.fire({
          title: "¿Quieres aprobar esta actividad?",
          html: `
                  <h6> Alumno Ayudante: ${this.nombreApellido}</h6>
                  <h6> Fecha de actividad: ${this.fechaActividad}</h6>
                  <h6> Hora de inicio: ${this.horaInicio}</h6>
                  <h6> Hora de termino: ${this.horaTermino}</h6>
                  <h6>Area de trabajo: ${this.areaTrabajo}</h6>
              `,
          showDenyButton: true,
          showCancelButton: true,
          confirmButtonText: "Aprobar",
          denyButtonText: `No aprobar`,
          cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
          try {
            this.actualizarSolicitud(id);
            Swal.fire("Actividad aprobada", "", "success");
          } catch (error: any) {
            Swal.fire("Error", error || "", "error");
          }
        } else if (result.isDenied) {
          this.notificarRechazo();
        }
      }
    })

  }

  private actualizarSolicitud(id: number) {
    this.solicitudService.aprobarSolicitud(id).subscribe({
      next: () => {
        this.traerSolicitudes()
        this.traerTodasSolicitudes()
      },
      error: (err: any) => {
        this.mensajeriaService.mostrarMensajeError('Error al aprobar la solicitud')
      }
    })
  }

  private traerTodasSolicitudes() {
    this.solicitudService.traerSolicitudes().subscribe({
      next: (response: { solicitudes: Solicitud[] }) => {
        this.solicitudService.setAllSolicitudes(response.solicitudes)
      },
      error: (err: any) => {
        this.mensajeriaService.mostrarMensajeError('Error al cargar todas las solicitudes')
      }
    })
  }
  
  private notificarRechazo() {
    this.solicitudService.notificarRechazoSolicitud().subscribe({
      next: () => {        
      },
      error: (err: any) => {
        this.mensajeriaService.mostrarMensajeExito('Notificación de rechazo enviada correctamente')
      }
    })
  }



}
