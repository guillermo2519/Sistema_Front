import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

import { ModalUsuariosComponent } from '../../Modales/modal-usuarios/modal-usuarios.component';
import { Usuarios } from 'src/app/Interfaces/usuarios';
import { UsuariosService } from 'src/app/Services/usuarios.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';
import Swal from 'sweetalert2';
import { Dialog } from '@angular/cdk/dialog';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit, AfterViewInit {

  columnasTabla : string[] = ['Nombre', 'correo', 'rol','proceso','empresa', 'acciones'];
  dataInicio : Usuarios[] = [];
  dataListaUsuarios = new MatTableDataSource(this.dataInicio);
  @ViewChild(MatPaginator) paginacionTabla! : MatPaginator;

  constructor(
    private dialog : MatDialog,
    private _usuarioService : UsuariosService,
    private _utilidadService : UtilidadService
  ) { }

  obtenerUsuarios() {
    //obtener roles
    this._usuarioService.lista().subscribe({
      next : (data) => {
        if(data.status)
           this.dataListaUsuarios.data = data.value;
        else
        this._utilidadService.mostrarAlerta("No se encontraron datos","Oops!")
      },
      error: (e) => {}
    })
  }

  ngOnInit(): void {
    this.obtenerUsuarios();
  }

  ngAfterViewInit(): void {
    this.dataListaUsuarios.paginator = this.paginacionTabla;
  }

  //filtrar tabla
  aplicarFiltroTabla(event : Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataListaUsuarios.filter = filterValue.trim().toLocaleLowerCase();
  }

  nuevoUsuario(){
    this.dialog.open(ModalUsuariosComponent, {
      disableClose : true
    }).afterClosed().subscribe(resultado => {
       if(resultado === "true") this.obtenerUsuarios();
    });
  }

  editarUsuario(usuario: Usuarios){
    this.dialog.open(ModalUsuariosComponent, {
      disableClose : true,
      data : usuario
    }).afterClosed().subscribe(resultado => {
       if(resultado === "true") this.obtenerUsuarios();
    });
  }

  eliminarUsuario(usuario: Usuarios){
    Swal.fire({
      title : '¿Desea eliminar el usuario?',
      text : usuario.nombre,
      icon : "warning",
      confirmButtonColor : '#3085d6',
      confirmButtonText : 'Si, eliminar',
      showCancelButton : true,
      cancelButtonColor : '#d33',
      cancelButtonText : 'No, volver'
    }).then((resultado =>  {
      if(resultado.isConfirmed){
        this._usuarioService.eliminarUsuario(usuario.idUsuario).subscribe({
          next:(data) => {

            if(data.status) {
              this._utilidadService.mostrarAlerta("El usuario ha sido eliminado", "Listo!");
              this.obtenerUsuarios();
            }else
            this._utilidadService.mostrarAlerta("No se pudo eliminar el usuario", "Error");          
          },
          error:(e) => {}
        })
      }
    }))
  }

}
