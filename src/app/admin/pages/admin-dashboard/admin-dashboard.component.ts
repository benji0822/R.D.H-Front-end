import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { GeneralModule } from '../../../shared/modules/general/general.module';
import { Event, NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { lastValueFrom, Subscription } from 'rxjs';
import { SocketService } from '../../../services/socket.service';
import { ReportesServicesService } from '../../../services/reportes-services.service';
import { AuthServicesService } from '../../../services/auth-services.service';
import { SolicitudService } from '../../../services/admin/solicitud.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from '../../../services/admin/admin.service';
import { Resumen } from './models/interfaces';

@Component({
  selector: 'app-admin-dashboard',
  imports: [GeneralModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit, OnDestroy {

  private socketService = inject(SocketService)
  private reporteService = inject(ReportesServicesService)
  private authService = inject(AuthServicesService)
  private solicitudService = inject(SolicitudService)
  private adminService = inject(AdminService)
  private snackBar = inject(MatSnackBar)


  loading: boolean = false;
  notificaciones: string[] = [];
  private notificationSub!: Subscription;

  constructor(private router:Router) {
        this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        this.loading = true;
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        this.loading = false;
      }
    });
  }



  async ngOnInit() {
    this.socketService.registerAsAdmin()
    this.notificationSub = this.socketService.listenNotification('admin')
      .subscribe((msg) => {
        this.openSnackBar(msg)
        this.notificaciones.push(msg)
        this.solicitudService.traerSolicitudesMes()
          .subscribe({
            next: (response) => {
              this.solicitudService.setSolicitud(response.solicitudes)
              this.solicitudService.setAllSolicitudes(response.solicitudes)
            }
          })

      });
  }

  ngOnDestroy(): void {
    this.notificationSub.unsubscribe();
    this.socketService.disconnect();
  }

  goTo(ruta: string) {
    this.router.navigate([ruta])
  }

  async downloadExcel() {
    try {
      const response = await lastValueFrom(this.reporteService.traerDatosAExportar())
      console.log(response)
      this.reporteService.exportToExcel(response).subscribe(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'resumen_mensual.xlsx';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      });

    } catch (error) {
      console.log(error)
    }
  }

  async logout() {
    try {
      const response = await lastValueFrom(this.authService.logout())
      this.router.navigate(['login'])
      console.log(response)
    } catch (error: any) {
      console.log(error)
    }
  }

  openSnackBar(msg:string) {
    this.snackBar.open(msg, 'deshacer', {
      duration: 3000
    })
  }




}
