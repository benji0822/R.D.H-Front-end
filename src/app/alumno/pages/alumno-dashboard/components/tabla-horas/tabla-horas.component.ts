import { Component, inject, OnInit } from '@angular/core';
import { GeneralModule } from '../../../../../shared/modules/general/general.module';
import { ResumenComponent } from '../resumen/resumen.component';
import { AlumnoService } from '../../../../../services/alumno/alumno.service';
import { Registro, ResumenMes } from '../../models/interfaces';
import { ActividadService } from '../../../../../services/alumno/actividad.service';
import { MensajeriaService } from '../../../../../services/mensajeria.service';

@Component({
  selector: 'app-tabla-horas',
  imports: [GeneralModule, ResumenComponent],
  templateUrl: './tabla-horas.component.html',
  styleUrl: './tabla-horas.component.css'
})
export class TablaHorasComponent implements OnInit {

  //servicios
  private alumnoService = inject(AlumnoService)
  private actividadService = inject(ActividadService)
  private mensajeriaService = inject(MensajeriaService)

  //variables publicas
  actividades!: Registro[] | undefined
  cargando: boolean = true

  //ngOnInit(antes de cargar el componente)
  async ngOnInit() {
    this.cargando = true
    await this.cargarActvidades()
    this.actividadService.resumenMes$.subscribe((resumenMes) => {
      this.actividades = resumenMes?.actividades
    })

    this.cargando = false
  }


  //carga las actividades del backend
  private async cargarActvidades() {
    this.cargando = true
    this.alumnoService.traerResumenMes().subscribe({
      next:(response:ResumenMes)=>{
        this.actividadService.setResumenMes(response)
      },
      error:(err:any)=>{
        this.mensajeriaService.mostrarMensajeError('Error al cargar las actividades del mes');
      },
      complete:()=>{
        this.cargando = false
      }
    })

  }





}
