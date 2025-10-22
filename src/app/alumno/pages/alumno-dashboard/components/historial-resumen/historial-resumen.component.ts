import { Component, inject, OnInit } from '@angular/core';
import { GeneralModule } from '../../../../../shared/modules/general/general.module';
import { NgxEchartsModule } from 'ngx-echarts';
import { ActividadService } from '../../../../../services/alumno/actividad.service';
import { TableroHistorialComponent } from '../tablero-historial/tablero-historial.component';
import { HorasArea } from '../../models/interfaces';


@Component({
  selector: 'app-historial-resumen',
  imports: [GeneralModule, NgxEchartsModule, TableroHistorialComponent],
  templateUrl: './historial-resumen.component.html',
  styleUrl: './historial-resumen.component.css'
})
export class HistorialResumenComponent implements OnInit {
  //servicios
  private actividadService: ActividadService = inject(ActividadService)

  //variables privadas
  private meses: string[] = ["enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"]
  private mesActual: number = new Date().getMonth()


  //variables publicas
  mesesHastaAhora: string[] = this.meses.slice(0, this.mesActual + 1)
  horasDifusion: number = 0
  horasExtension: number = 0
  horasDesarrolloLaboral: number = 0
  horasComunicacion: number = 0

  // grafico de barras
  barChartOptions = {
    title: {
      text: 'Horas por actividad'
    },
    tooltip: {},
    xAxis: {
      type: 'category',
      data: ['D', 'E', 'C', 'DL']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: 'Horas',
        type: 'bar',
        data: [
          this.horasDifusion,
          this.horasExtension,
          this.horasComunicacion,
          this.horasDesarrolloLaboral
        ],
        itemStyle: {
          color: function (params: any) {
            const colors = ['#5C7BD9', '#57D9A3', '#F5A623', '#D9555C'];
            return colors[params.dataIndex];
          }
        }
      }
    ]
  };

  ngOnInit() {
    this.filtrarHorasMes()
    this.actividadService.actividades$.subscribe(() => {
      this.barChartOptions = {
        ...this.barChartOptions,
        series: [
          {
            ...this.barChartOptions.series[0],
            data: [
              this.horasDifusion,
              this.horasExtension,
              this.horasComunicacion,
              this.horasDesarrolloLaboral
            ]
          }
        ]
      }
    })

    this.actividadService.horasFiltradas$.subscribe((horasFiltradas) => {
      if (horasFiltradas) {
        horasFiltradas.forEach((area: any) => {
          switch (area.nombre) {
            case 'Difusión':
              this.horasDifusion = area.duracion_horas
              break;
            case 'Desarrollo Laboral':
              this.horasDesarrolloLaboral = area.duracion_horas
              break;
            case 'Extensión':
              this.horasExtension = area.duracion_horas
              break;
            case 'Comunicación':
              this.horasComunicacion = area.duracion_horas
              break;

            default:
              break;
          }
        });

        this.barChartOptions = {
          ...this.barChartOptions,
          series: [
            {
              ...this.barChartOptions.series[0],
              data: [
                this.horasDifusion,
                this.horasExtension,
                this.horasComunicacion,
                this.horasDesarrolloLaboral
              ]
            }
          ]
        }


      }

    })



  }

  filtrarHorasMes(mes: number | null = null) {
    let mesFiltro
    if (mes || mes === 0) {
      mesFiltro = mes + 1
    }
    this.actividadService.traerHorasFiltradas(mesFiltro).subscribe({
      next: (response: { horasArea: HorasArea[] }) => {
        this.actividadService.setHorasFiltradas(response.horasArea)
      }
    })

  }

}
