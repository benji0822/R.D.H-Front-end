import { Component, inject } from '@angular/core';
import { GeneralModule } from '../../../../../shared/modules/general/general.module';
import { ReportesServicesService } from '../../../../../services/reportes-services.service';
import { ModeloOc } from '../../models/interfaces';
import { AdminService } from '../../../../../services/admin/admin.service';
import { MensajeriaService } from '../../../../../services/mensajeria.service';

@Component({
  selector: 'app-gestor-oc',
  imports: [GeneralModule],
  templateUrl: './gestor-oc.component.html',
  styleUrl: './gestor-oc.component.css'
})
export class GestorOcComponent {

  file: File | null = null
  reporteOC!: ModeloOc[]
  private reporteService = inject(ReportesServicesService)
  private adminService = inject(AdminService)
  private mensajeriaService = inject(MensajeriaService)

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.file = input.files[0];
    }
  }

  mandarExcel() {
    const data = new FormData()
    if (!this.file) {
      this.mensajeriaService.mostrarMensajeError('No hay archivo seleccionado!')
      return
    }
    data.append('file', this.file)

    this.reporteService.mostrarOrdenesCompras(data).subscribe({
      next: (res: any) => this.reporteOC = res.datos_filtrados,
      error: (err: any) => {
        this.mensajeriaService.mostrarMensajeError('Error al subir archivo. Por favor, vuelve a seleccionarlo.');
        this.file = null;
      }
    })

  }

  registrarOC(run: string, oc: number) {
    this.adminService.registrarOC(run, oc).subscribe({
      next: () => {
        this.mensajeriaService.mostrarMensajeExito('Orden de compra registrada!')
      },
      error: (err: any) => {
        this.mensajeriaService.mostrarMensajeError('Error al registrar la orden de compra. Por favor, verifica los datos ingresados.')
      }
    })
  }

  registrarAllOC() {
    if (!this.reporteOC) {
      this.mensajeriaService.mostrarMensajeError('No hay ordenes de compras disponibles!')
      return
    }
    try {
      this.adminService.registrarAllOC(this.reporteOC).subscribe({
        next: () => {
          this.mensajeriaService.mostrarMensajeExito('Registros exitosos!')
        }
      })
    } catch (error: any) {
      console.error(error)
    }
  }

}
