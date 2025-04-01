import { Injectable } from '@angular/core';


import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ResponseApi } from '../Interfaces/response-api';
import { Login } from '../Interfaces/login';
import { Usuarios } from '../Interfaces/usuarios';
import { ControlDocumental } from '../Interfaces/control-documental';
import { NotificacionesService } from './notificaciones.service';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ControlDocumentalService {

   private urlApi:string = environment.endpoint + "Control_Documental/";

   constructor(private http:HttpClient,
               private notificacionesService: NotificacionesService 
   ) { }

  //regresa la lista de usuarios
  lista():Observable<ResponseApi> {
    return this.http.get<ResponseApi>(`${this.urlApi}Lista`)
  }

  crearDocumento(request: ControlDocumental):Observable<ResponseApi> {
    return this.http.post<ResponseApi>(`${this.urlApi}Crear`, request)
  }  

  editar(request: ControlDocumental):Observable<ResponseApi> {
    return this.http.put<ResponseApi>(`${this.urlApi}Editar`, request)
  }

  editarEstado(request: ControlDocumental):Observable<ResponseApi> {
    return this.http.put<ResponseApi>(`${this.urlApi}EditarEstado`, request)
  }

  actualizarArchivo(id: number, archivo: File): Observable<any> {
    const formData = new FormData();
    formData.append('archivo', archivo);
    return this.http.put(`${this.urlApi}ActualizarArchivo/${id}`, formData);
  }
  
  
  elimininar(id: number):Observable<ResponseApi> {
    return this.http.delete<ResponseApi>(`${this.urlApi}Eliminar/${id}`)
  }
  
}


  /*
    crearDocumento(request: ControlDocumental): Observable<ResponseApi> {
    return this.http.post<ResponseApi>(`${this.urlApi}Crear`, request).pipe(
      switchMap((response: ResponseApi) => {
        // Obtener el rol del usuario desde la sesión
        const rol = this.getRolDelUsuario();  // Método para obtener el rol del usuario
        const mensaje = `Se ha creado un nuevo documento: ${request.nombrE_DOCUMENTO}`;

        // Enviar la notificación usando el servicio
        return this.notificacionesService.crearNotificacion({
          rol: rol,
          mensaje: mensaje
        });
      })
    );
  }

    // Método para obtener el rol del usuario desde la sesión (esto depende de cómo guardas la sesión)
  private getRolDelUsuario(): number {
    // Este es un ejemplo básico. Necesitas ajustar esto dependiendo de cómo manejas la sesión
    return 1; // Retorna el rol del usuario de la sesión activa, por ejemplo
  }
  */
