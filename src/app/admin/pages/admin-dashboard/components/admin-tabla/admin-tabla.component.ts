import { Component, inject, OnInit } from '@angular/core';
import { GeneralModule } from '../../../../../shared/modules/general/general.module';
import { AdminService } from '../../../../../services/admin/admin.service';
import { ActividadAlumno, Alumno, InfoAlumno, Resumen } from '../../models/interfaces';
import { MensajeriaService } from '../../../../../services/mensajeria.service';

@Component({
  selector: 'app-admin-tabla',
  imports: [GeneralModule],
  templateUrl: './admin-tabla.component.html',
  styleUrl: './admin-tabla.component.css'
})
export class AdminTablaComponent implements OnInit {
  //servicios
  private adminService: AdminService = inject(AdminService)
  private mensajeriaService = inject(MensajeriaService)

  //variables publicas
  horaAreaMes: number = 0
  horasResumenMes: number = 0
  alumnos: number = 0

  area: string = ''
  horasTotales: number = 0
  horasMes: number = 0
  run: string = ''
  nombre: string = ''
  email: string = ''
  fono: number = 0
  actividades: ActividadAlumno[] = []
  alumnosAyudantes: Alumno[] = []

  ngOnInit() {
    this.traerResumenMes()
    this.traerAlumnosAyudantes()
    this.adminService.resumenMes$.subscribe((resumen) => {
      if (resumen) {
        this.horasResumenMes = resumen.actividades
        this.horaAreaMes = resumen.actividades_area
        this.area = resumen.area
        this.alumnos = resumen.alumnos
      }
    })
    this.adminService.actividades$.subscribe((actividades) => {
      this.actividades = actividades
    })
    this.adminService.infoAlumno$.subscribe((infoAlumno) => {
      if (infoAlumno) {
        this.nombre = infoAlumno.alumno.nombre
        this.run = infoAlumno.alumno.run
        this.email = infoAlumno.alumno.email
        this.fono = infoAlumno.alumno.fono
        this.horasTotales = infoAlumno.actividades_mes
        this.horasMes = infoAlumno.actividades_area
      }
    })

  }

  //traer alumnos ayudantes
  private traerAlumnosAyudantes() {

    this.adminService.traerAlumnos().subscribe({
      next: (response: { alumnos: Alumno[] }) => {
        const alumnos: Alumno[] = response.alumnos
        this.alumnosAyudantes = alumnos
      },
      error: (error) => {
        this.mensajeriaService.mostrarMensajeError('Error al cargar los alumnos ayudantes')
      }
    })

  }

  private traerResumenMes() {
    this.adminService.traerResumenMes().subscribe({
      next: (response: { resumen: Resumen }) => {
        const resumen: Resumen = response.resumen
        this.adminService.setResumenMes(resumen)
      },
      error: (error) => {
        this.mensajeriaService.mostrarMensajeError('Error al cargar el resumen del mes')
      }
    })
  }

  mostrarDetalles(run: string) {
    this.adminService.traerDetalleAlumno(run).subscribe({
      next: (response: { infoAlumno: InfoAlumno }) => {
        const infoAlumno: InfoAlumno = response.infoAlumno
        this.adminService.setInfoAlumno(infoAlumno)
      },
      error: (err: any) => {
        this.mensajeriaService.mostrarMensajeError('Error al cargar los detalles del alumno')
      }
    })

    this.adminService.traerActividadesAlumno(run).subscribe({
      next: (response: { actividades: ActividadAlumno[] }) => {
        const actividades: ActividadAlumno[] = response.actividades
        this.adminService.setActividades(actividades)
      },
      error: (error) => {
        this.mensajeriaService.mostrarMensajeError('Error al cargar las actividades del alumno')
      }
    })
  }



}
