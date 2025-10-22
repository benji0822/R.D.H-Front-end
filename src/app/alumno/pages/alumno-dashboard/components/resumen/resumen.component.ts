import { Component, inject, OnInit } from '@angular/core';
import { GeneralModule } from '../../../../../shared/modules/general/general.module';
import { lastValueFrom } from 'rxjs';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AlumnoService } from '../../../../../services/alumno/alumno.service';
import { ActividadService } from '../../../../../services/alumno/actividad.service';
import { ResumenMes } from '../../models/interfaces';
import { MensajeriaService } from '../../../../../services/mensajeria.service';


@Component({
  selector: 'app-resumen',
  imports: [GeneralModule, MatMenuModule, MatIconModule, MatButtonModule],
  templateUrl: './resumen.component.html',
  styleUrl: './resumen.component.css'
})
export class ResumenComponent implements OnInit {
  //servicios
  private alumnoService = inject(AlumnoService)
  private actividadService = inject(ActividadService)
  private mensajeriaService = inject(MensajeriaService)

  //variables publicas
  montoAcumulado?: string
  horasTrabajadas?: number
  fechaPago: any
  diasRestantes: any
  cargando: boolean = true
  mesActual = new Intl.DateTimeFormat('es-CL', { month: 'long' }).format(new Date()).toString()
  ordenCompra: number = 0
  //variables privadas


  //ngOnInit(antes de cargar el componente)
  ngOnInit() {
    this.cargando = true
    this.traerResumenMes()
    this.actividadService.resumenMes$.subscribe((resumenMes) => {
      const monto = resumenMes?.monto || 0
      this.montoAcumulado = this.formatearCLP(monto)
      this.horasTrabajadas = resumenMes?.horas_totales_mes
    })
    this.alumnoService.OC$.subscribe((oc) => {
      this.ordenCompra = oc || 0
    })
    this.traerFechaAproxPago()
    this.traerOC()
    this.cargando = false
  }


  private traerFechaAproxPago() {
    this.cargando = true
    const hoy = new Date();
    let añoActual = hoy.getFullYear();
    let mes = hoy.getMonth(); // 0 = enero

    for (let intento = 0; intento < 2; intento++) {
      // Buscar entre el 15 y el 21 (tercera semana)
      for (let dia = 15; dia <= 21; dia++) {
        const fecha = new Date(añoActual, mes, dia);
        if (fecha.getDay() === 5) { // 5 = viernes
          // Verificar si la fecha aún no ha pasado
          if (fecha >= hoy) {
            const diferenciaMs = fecha.getTime() - hoy.getTime();
            const diasRestantes = Math.ceil(diferenciaMs / (1000 * 60 * 60 * 24));
            this.diasRestantes = diasRestantes;

            const opciones = new Intl.DateTimeFormat('es-CL', {
              day: 'numeric',
              month: 'long'
            }).format(fecha);

            this.fechaPago = opciones;
            return; // Salir del loop una vez encontrada la fecha válida
          }
        }
      }

      // Si no se encontró o ya pasó, pasar al siguiente mes
      mes++;
      if (mes > 11) {
        mes = 0;
        añoActual++;
      }
    }
  }

  private traerResumenMes() {
    this.alumnoService.traerResumenMes().subscribe({
      next: (resumenMes: ResumenMes) => {
        this.actividadService.setResumenMes(resumenMes);
      },
      error: (error) => {
        this.mensajeriaService.mostrarMensajeError('Error al cargar el resumen del mes');
      }
    })
  }

  formatearCLP(valor: number): string {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(valor)
  }

  private traerOC() {
    this.alumnoService.obtenerOC().subscribe({
      next:(response:{oc:{numero_oc:number}})=>{
        this.alumnoService.setOC(response.oc.numero_oc)
      },
      error: (error) => {
        this.mensajeriaService.mostrarMensajeError('Error al cargar la orden de compra');
      }
    })
  }


}





