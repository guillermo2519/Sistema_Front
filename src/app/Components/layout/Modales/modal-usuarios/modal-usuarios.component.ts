import { Component, Inject, OnInit, inject } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Roles } from 'src/app/Interfaces/roles';
import { Usuarios } from 'src/app/Interfaces/usuarios';

import { RolesService } from 'src/app/Services/roles.service';
import { UsuariosService } from 'src/app/Services/usuarios.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';
import { EmpresaService } from 'src/app/Services/empresa.service';
import { Empresa } from 'src/app/Interfaces/empresa';

@Component({
  selector: 'app-modal-usuarios',
  templateUrl: './modal-usuarios.component.html',
  styleUrls: ['./modal-usuarios.component.css']
})
export class ModalUsuariosComponent implements OnInit {

  formularioUsuario : FormGroup;
  ocultarPassword : boolean = true;
  tituloAccion : string = "Agregar";
  botonAccion : string = "Guardar";
  listaRoles : Roles[] = [];
  listaEmpresas: Empresa[] = [];
  listaProcesos = [
    { valor: 'analitico', nombre: 'Analítico' },
    { valor: 'operativo', nombre: 'Operativo' },
    { valor: 'estrategico', nombre: 'Estratégico' }
  ];
  

  constructor(
    private modalActual : MatDialogRef<ModalUsuariosComponent>,
    //inyectar el componente para que pueda recibir los datos
    @Inject(MAT_DIALOG_DATA) public datosUsuario : Usuarios,
    //Crea los campos del formulario 
    private fb : FormBuilder,
    private _rolService : RolesService,
    private _usuarioService : UsuariosService,
    private _utilidadServicio : UtilidadService,
    private _empresaService: EmpresaService // Inyectar el servicio Empresa
  ) { 
    //Declarar campos del formulario
    this.formularioUsuario = this.fb.group({
      nombre : ['', Validators.required],
      correo : ['', Validators.required],
      rol : ['', Validators.required],
      clave : ['', Validators.required],
      idEmpresa : ['', Validators.required],
      proceso: ['']
    });
    

    if(this.datosUsuario != null) {

      this.tituloAccion = "Editar",
      this.botonAccion = "Actualizar"
    }

    //obtener roles
    this._rolService.lista().subscribe({
      next : (data) => {
        if(data.status) {
          this.listaRoles = data.value
          console.log('Valor de rol:', this.datosUsuario?.rol);  // Verifica si el valor coincide con los ID de los roles
          console.log(this.listaRoles);
        }
      },
      error: (e) => {}
    });

    this._empresaService.lista().subscribe({
      next: (data) => {
        // Verifica si la respuesta contiene los datos esperados
        console.log('Datos de la empresa:', data);
    
        if (data && Array.isArray(data)) {
          // Si 'data' es un arreglo, asigna directamente a listaEmpresas
          this.listaEmpresas = data; 
          console.log('Lista de empresas:', this.listaEmpresas);
        } else {
          console.error('Error al obtener empresas: respuesta no válida', data);
        }
      },
      error: (e) => {
        console.error('Error al obtener empresas:', e);
      }
    });
    
    

  }

  ngOnInit(): void {
    console.log('Data Documentos en el ngOnInit:', this.datosUsuario);
  
    if (this.datosUsuario && this.datosUsuario.idEmpresa != null) {
      this.formularioUsuario.patchValue({
        nombre: this.datosUsuario.nombre,
        correo: this.datosUsuario.email,
        rol: this.datosUsuario.rol,
        clave: this.datosUsuario.passwordHash,
        idEmpresa: this.datosUsuario.idEmpresa,
        proceso: this.datosUsuario.proceso
      });
  
      console.log('ID Empresa seleccionado:', this.datosUsuario?.idEmpresa);
    }
  
    console.log('Lista de empresas en ngOnInit:', this.listaEmpresas);
  }



  guardarEditar_Usuario(){
    console.log('dataDocumentos para verificar si hay ID:', this.datosUsuario); 
    const _usuario: Usuarios = {
      idUsuario: this.datosUsuario == null ? 0 : this.datosUsuario.idUsuario,
      nombre: this.formularioUsuario.value.nombre,
      email: this.formularioUsuario.value.correo,
      rol: this.formularioUsuario.value.rol,
      descripcion: "",
      passwordHash: this.formularioUsuario.value.clave,
      idEmpresa: this.formularioUsuario.value.idEmpresa, // Pasar el ID de la empresa seleccionada
      proceso: this.formularioUsuario.value.proceso
    };
    

   console.log('_controDocumental', _usuario); 

   if(this.datosUsuario == null){
    this._usuarioService.guardarUsuario(_usuario).subscribe({
      next : (data) => {
        if(data.status){
          this._utilidadServicio.mostrarAlerta("El usuario fue registrado","Exito");
          this.modalActual.close("true")
        }else
         this._utilidadServicio.mostrarAlerta("No se pudo registrar el usuario","Error");
      },
      error:(e) =>{}
    })
   }else{

    this._usuarioService.editarUsuario(_usuario).subscribe({
      next : (data) => {
        if(data.status){
          this._utilidadServicio.mostrarAlerta("El usuario fue editado","Exito");
          this.modalActual.close("true")
        }else
         this._utilidadServicio.mostrarAlerta("No se pudo editar el usuario","Error");
      },
      error:(e) =>{}
    })
    
   }


  }

}
