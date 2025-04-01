import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ResponseApi } from '../Interfaces/response-api';
import { Login } from '../Interfaces/login';
import { Usuarios } from '../Interfaces/usuarios';
import { ControlDocumental } from '../Interfaces/control-documental';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  private urlApi:string = environment.endpoint + "Empresa/";

  constructor(private http:HttpClient) { }

    //regresa la lista de usuarios
    lista():Observable<ResponseApi> {
      return this.http.get<ResponseApi>(`${this.urlApi}Lista`)
    }
  
    

}
