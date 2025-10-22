import { Component, inject, OnInit } from '@angular/core';
import { GeneralModule } from '../../../../../shared/modules/general/general.module';
import { MatSelectModule } from '@angular/material/select'
import { ActividadService } from '../../../../../services/alumno/actividad.service';
import { lastValueFrom } from 'rxjs';
import { AreaTrabajo } from '../../../../../models/interfaces';
import { AreaTrabajoService } from '../../../../../services/area-trabajo.service';

@Component({
  selector: 'app-tablero-historial',
  imports: [GeneralModule, MatSelectModule],
  templateUrl: './tablero-historial.component.html',
  styleUrl: './tablero-historial.component.css',
  standalone: true
})
export class TableroHistorialComponent implements OnInit {
  //servicios
  private actividadService: ActividadService = inject(ActividadService)
  private areaTrabajoService = inject(AreaTrabajoService)


  //variables privadas
  private meses: string[] = ["enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"]
  private mesActual: number = new Date().getMonth()
  private mesFiltro!: number | undefined
  private areaFiltro!: number | undefined

  //variables publicas
  mesesHastaAhora: string[] = this.meses.slice(0, this.mesActual + 1)
  actividades: any
  areasTrabajo!:AreaTrabajo[]

  //ngoninit
  async ngOnInit() {
    await this.traerAreasTrabajo()
    await this.filtrarActividades()
  }


  async filtrarActividades() {
    try {
      const response = await lastValueFrom(this.actividadService.traerActividadesFiltradas(this.mesFiltro,this.areaFiltro))
      this.actividades = response.actividades
    } catch (error: any) {
      console.error(error)
    }
  }

  asignarMes(mes: number | undefined) {
    if (mes || mes === 0) {
      const mesFiltro = mes + 1
      this.mesFiltro = mesFiltro
    }else{
      this.mesFiltro = undefined
    }
  }

  asignarArea(area: number | undefined) {
    if (area) {
      this.areaFiltro = area
    } else {
      this.areaFiltro = undefined
    }
  }

  async traerAreasTrabajo(){
    try {
      const response = await lastValueFrom(this.areaTrabajoService.traerAreasTrabajo())
      this.areasTrabajo = response
    } catch (error: any) {
      console.error(error)
    }
  }

}
