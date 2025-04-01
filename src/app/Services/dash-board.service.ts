import { Injectable } from '@angular/core';


import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ResponseApi } from '../Interfaces/response-api';


@Injectable({
  providedIn: 'root'
})
export class DashBoardService {

    //variable para arma la url de la api
    private urlApi:string = environment.endpoint + "DashBoard/";

    constructor(private http:HttpClient) { }
  
    //regresa la lista de roles
    resumen():Observable<ResponseApi> {
      return this.http.get<ResponseApi>(`${this.urlApi}Resumen`)
    }
    
}
