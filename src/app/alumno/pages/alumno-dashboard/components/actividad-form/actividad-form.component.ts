import { Component, inject, OnInit } from '@angular/core';
import { GeneralModule } from '../../../../../shared/modules/general/general.module';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActividadService } from '../../../../../services/alumno/actividad.service';
import { AreaTrabajo } from '../../../../../models/interfaces';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MensajeriaService } from '../../../../../services/mensajeria.service';
import { AlumnoService } from '../../../../../services/alumno/alumno.service';
import { HorasArea } from '../../models/interfaces';
import { NgxEchartsModule } from 'ngx-echarts';


@Component({
  selector: 'app-actividad-form',
  imports: [GeneralModule, ReactiveFormsModule, FormsModule, NgxEchartsModule],
  templateUrl: './actividad-form.component.html',
  styleUrl: './actividad-form.component.css',
  providers: [provideNativeDateAdapter()]
})
export class ActividadFormComponent implements OnInit {

  //servicios
  private actividadService = inject(ActividadService)
  private mensajeService = inject(MensajeriaService)
  private alumnoService = inject(AlumnoService)

  //variables privadas
  private horasAreaMes!: HorasArea[]
  areasTrabajo!: AreaTrabajo[]

  //formbuilder
  private fb = inject(FormBuilder)


  //variables publicas
  //formulario de actividades
  actividadForm: FormGroup = this.fb.group({
    fecha: ['', Validators.required],
    horaInic: ['', Validators.required],
    horaTerm: ['', Validators.required],
    area: ['', Validators.required]
  })

  horasAM = ['07:00', '07:15', '07:30', '07:45',
    '08:00', '08:15', '08:30', '08:45', '09:00', '09:15', '09:30', '09:45', '10:00', '10:15', '10:30', '10:45', '11:00', '11:15', '11:30', '11:45',]

  horasPM = ['12:00', '12:15', '12:30', '12:45', '13:00', '13:15', '13:30', '13:45', '14:00', '14:15', '14:30', '14:45', '15:00', '15:15', '15:30', '15:45', '16:00', '16:15', '16:30', '16:45',
    '17:00', '17:15', '17:30', '17:45', '18:00', '18:15', '18:30', '18:45', '19:00', '19:15', '19:30', '19:45', '20:00', '20:15', '20:30', '20:45',
    '21:00', '21:15', '21:30', '21:45', '22:00', '22:15', '22:30', '22:45', '23:00', '23:15', '23:30', '23:45',]

  chartOptions: any = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: '5%',
      left: 'center'
    },
    series: [
      {
        name: 'Areas de trabajo',
        type: 'pie',
        radius: '50%',
        data: [],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };





  async ngOnInit() {
    this.traerAreas()//check
    this.traerHorasArea()
    this.alumnoService.horasAreaMes$.subscribe((horasArea) => {
      this.horasAreaMes = horasArea
      this.actualizarGrafico()
    })
  }

  //metodo para registrar horas (Public)
  async registrarHora() {
    //validar formulario
    if (!this.actividadService.validarActividad(this.actividadForm)) {
      return;
    }

    //formateo de valores
    const fecha = new Date(this.actividadForm.get('fecha')?.value);
    fecha.setHours(12); // ✅ evitar desfase

    //formateo de horas
    const horaInic = this.actividadForm.get('horaInic')?.value;
    const horaTerm = this.actividadForm.get('horaTerm')?.value;
    //valores a mandar en el backend
    const body = {
      fecha_actividad: fecha,
      hora_inic_activdad: horaInic,
      hora_term_actividad: horaTerm,
      area_trabajo: this.actividadForm.get('area')?.value
    }

    this.actividadService.registrarActividad(body).subscribe({
      next: (response) => {
        this.mensajeService.mostrarMensajeExito(`${response.message} Tus horas seran validadas pronto!`);
        this.traerHorasArea();
      },
      error: (error) => {
        this.mensajeService.mostrarMensajeError(error.error.message);
      }
    })
  }

  private traerAreas() {
    this.alumnoService.traerAreas().subscribe({
      next: (response) => {
        this.areasTrabajo = response;
      },
      error: (error) => {
        console.error(error);
        this.mensajeService.mostrarMensajeError('Error al cargar las áreas de trabajo.');
      }
    })
  }

  private traerHorasArea() {
    this.alumnoService.traerHorasAreasMes().subscribe({
      next: (response) => {
        const horasArea = response.horasArea;
        this.alumnoService.setHorasAreaMes(horasArea);
        this.actualizarGrafico()
      },
      error: (err: any) => {
        this.mensajeService.mostrarMensajeError('Error al cargar las horas de área del mes.');
      }
    })
  }

  actualizarGrafico() {
    this.chartOptions = {
      ...this.chartOptions,
      series: [
        {
          ...this.chartOptions.series[0],
          data: this.horasAreaMes.map(horaArea => ({
            value: horaArea.duracion_horas,
            name: horaArea.nombre
          }))
        }
      ]
    };
  }

  hasErrors(campo: string): boolean {
    if (this.actividadForm.get(campo)?.hasError('required') && this.actividadForm.get(campo)?.touched) {
      return true
    }
    return false
  }

}
