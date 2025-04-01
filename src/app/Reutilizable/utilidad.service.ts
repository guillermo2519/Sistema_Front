import { Injectable } from '@angular/core';

import { MatSnackBar } from '@angular/material/snack-bar';
import { Sesion } from '../Interfaces/sesion';

@Injectable({
  providedIn: 'root'
})
export class UtilidadService {

  constructor(private _snackBar: MatSnackBar) { }

  //metodo que devuelve un mensaje de alerte
  mostrarAlerta(mensaje: string, tipo:string){

     this._snackBar.open(mensaje, tipo ,{
      horizontalPosition:"end",
      verticalPosition:"top",
      duration: 3000
     })

  }

  guardarSesionUsuario(idUsuario: string, usuarioSession: Sesion) {
    console.log("Guardando usuario con idEmpresa:", usuarioSession.idEmpresa); // Asegúrate de que idEmpresa esté aquí
    localStorage.setItem("idUsuario", idUsuario);
    localStorage.setItem("usuario", JSON.stringify(usuarioSession)); // Guarda el objeto completo del usuario
    localStorage.setItem("idEmpresa", usuarioSession.idEmpresa.toString()); // Guarda idEmpresa por separado también
  }
  
  obtenerSesionUsuario() {

    const dataCadena = localStorage.getItem("usuario");
    const usuario = JSON.parse(dataCadena!)
    return usuario;
  }
  
  eliminarSesionUsuario() {

   localStorage.removeItem("usuario");
   localStorage.removeItem("idUsuario");
  }

}
