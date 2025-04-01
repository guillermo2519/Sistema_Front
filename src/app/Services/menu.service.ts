import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ResponseApi } from '../Interfaces/response-api';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

    //variable para arma la url de la api
    private urlApi:string = environment.endpoint + "Menu/";

    constructor(private http:HttpClient) { }
  
    lista(IdUsuario: number):Observable<ResponseApi> {
      return this.http.get<ResponseApi>(`${this.urlApi}Lista?IdUsuario=${IdUsuario}`)
    }
    
}
