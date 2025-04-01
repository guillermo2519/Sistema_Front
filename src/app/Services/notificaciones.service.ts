import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ResponseApi } from '../Interfaces/response-api';

@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {
  private urlApi: string = environment.endpoint + 'Notificaciones/';

  constructor(private http: HttpClient) {}

  obtenerNotificaciones(idUsuario: number): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(`${this.urlApi}${idUsuario}`);
  }


  marcarComoLeida(idNotificacion: number): Observable<ResponseApi> {
    return this.http.put<ResponseApi>(
      `${this.urlApi}${idNotificacion}/marcar-como-leida`,
      {}
    );
  }

  crearNotificacion(request: any): Observable<ResponseApi> {
    return this.http.post<ResponseApi>(`${this.urlApi}`, request);
  }
}
