import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ruta, rutaPY } from './rutas';

@Injectable({
  providedIn: 'root'
})
export class ReportesServicesService {

  private http = inject(HttpClient)
  private url = rutaPY
  private nodeUrl = ruta

  exportToExcel(data: any) {
    return this.http.post(`${this.url}/exportar`, data, {
      responseType: 'blob'  // Indicamos que es archivo binario
    });
  }

  traerDatosAExportar(): Observable<any> {
    return this.http.get(`${this.nodeUrl}/admin/exportar`, { withCredentials: true })
  }

  mostrarOrdenesCompras(file: any): Observable<any> {
    return this.http.post(`${this.url}/mandar_oc`, file)
  }

}
