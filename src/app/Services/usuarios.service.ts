import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ResponseApi } from '../Interfaces/response-api';
import { Login } from '../Interfaces/login';
import { Usuarios } from '../Interfaces/usuarios';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  //variable para arma la url de la api
  private urlApi:string = environment.endpoint + "Usuario/";

  constructor(private http:HttpClient) { }

  iniciarSesion(request: Login):Observable<ResponseApi> {
    return this.http.post<ResponseApi>(`${this.urlApi}IniciarSesion`, request)
  }

  //regresa la lista de usuarios
  lista():Observable<ResponseApi> {
    return this.http.get<ResponseApi>(`${this.urlApi}Lista`)
  }

  guardarUsuario(request: Usuarios):Observable<ResponseApi> {
    return this.http.post<ResponseApi>(`${this.urlApi}GuardarUsuario`, request)
  }

  editarUsuario(request: Usuarios):Observable<ResponseApi> {
    return this.http.put<ResponseApi>(`${this.urlApi}EditarUsuario`, request)
  }

  eliminarUsuario(id: number):Observable<ResponseApi> {
    return this.http.delete<ResponseApi>(`${this.urlApi}EliminarUsuario/${id}`)
  }

}
