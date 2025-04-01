import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ResponseApi } from '../Interfaces/response-api';
import { Login } from '../Interfaces/login';
import { Usuarios } from '../Interfaces/usuarios';
import { NotificacionesService } from './notificaciones.service';
import { switchMap } from 'rxjs/operators';
import { Tareas } from '../Interfaces/tareas';


@Injectable({
  providedIn: 'root'
})
export class TareasService {

  private urlApi: string = environment.endpoint + "Tareas_/"; 


  constructor(private http:HttpClient,) { }

  lista():Observable<ResponseApi> {
    return this.http.get<ResponseApi>(`${this.urlApi}Lista`)
  }

  crearTarea(request: Tareas):Observable<ResponseApi> {
    return this.http.post<ResponseApi>(`${this.urlApi}Crear`, request)
  }  

  editar(request: Tareas):Observable<ResponseApi> {
    return this.http.put<ResponseApi>(`${this.urlApi}Editar`, request)
  }

  editarEstado(request: Tareas):Observable<ResponseApi> {
    return this.http.put<ResponseApi>(`${this.urlApi}EditarEstado`, request)
  }
  
  elimininar(id: number):Observable<ResponseApi> {
    return this.http.delete<ResponseApi>(`${this.urlApi}Eliminar/${id}`)
  }
  

}
