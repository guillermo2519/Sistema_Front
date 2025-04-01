import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ControlDocumentalService } from 'src/app/Services/control-documental.service';
import { ControlDocumental } from 'src/app/Interfaces/control-documental';
import { MatDialog } from '@angular/material/dialog';
import { ModalControlDocumentalComponent } from '../../Modales/modal-control-documental/modal-control-documental.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';

import { forkJoin } from 'rxjs';
import { Tareas } from 'src/app/Interfaces/tareas';
import { TareasService } from 'src/app/Services/tareas.service';

@Component({
  selector: 'app-tareas-pendientes',
  templateUrl: './tareas-pendientes.component.html',
  styleUrls: ['./tareas-pendientes.component.css']
})
export class TareasPendientesComponent implements OnInit {

  @ViewChild('fileInput') fileInput!: ElementRef;
    selectedFile: File | null = null;
    tareasForm!: FormGroup;  
  
  
      columnasTabla: string[] = ['title', 'descripcion', 'COMPLETED', 'proceso', 'aprueba', 'createD_AT', 'updateD_AT'];
      dataInicio : Tareas[] = [];
      dataListaTareas = new MatTableDataSource(this.dataInicio);
      @ViewChild(MatPaginator) paginacionTabla! : MatPaginator;
    
      selectedFileName: string | null = null; // Variable para almacenar el nombre del archivo
      

  constructor(
     private fb: FormBuilder,
        private _TareasService: TareasService,
        private dialog : MatDialog,
        private _utilidadService : UtilidadService
  ) { }


  obtenerTareas() {
    const usuario = this._utilidadService.obtenerSesionUsuario();
  
    if (!usuario) {
      this._utilidadService.mostrarAlerta('No se pudo obtener la sesión del usuario', 'Error');
      return;
    }
  
    // Obtener el idEmpresa sin filtrar
    const idEmpresa = usuario.idEmpresa;
  
    this._TareasService.lista().subscribe({
      next: (response: any) => {
        console.log("Datos obtenidos de la API:", response);
  
        if (Array.isArray(response) && response.length > 0) {
          // Filtrar solo las tareas que no están completadas (COMPLETED: false)
          const tareasPendientes = response.filter((task: any) => task.COMPLETED === false);
  
          // Asignar las tareas filtradas a la tabla
          this.dataListaTareas.data = tareasPendientes;
  
          // Actualiza la vista de la tabla
          this.dataListaTareas._updateChangeSubscription();
  
          // Asegúrate de que la paginación esté configurada correctamente
          this.dataListaTareas.paginator = this.paginacionTabla;
        } else {
          this._utilidadService.mostrarAlerta('No se encontraron registros', 'Error');
        }
      },
      error: (err) => {
        console.error("Error al obtener tareas:", err);
        this._utilidadService.mostrarAlerta('Error al cargar tareas', 'Error');
      }
    });
  }
  

  ngOnInit(): void {

    this.obtenerTareas();

    // Inicialización del formulario reactivo con los campos de la interfaz Tareas
    this.tareasForm = this.fb.group({
      TITLE: ['', Validators.required],         // Campo 'TITLE' de tipo texto
      DESCRIPCION: ['', Validators.required],   // Campo 'DESCRIPCION' de tipo texto
      COMPLETED: [false, Validators.required],  // Campo 'COMPLETED' de tipo booleano
      PROCESO: ['', Validators.required],       // Campo 'PROCESO' de tipo texto
      APRUEBA: ['', Validators.required],       // Campo 'APRUEBA' de tipo texto
    });
  }

  
  ngAfterViewInit(): void {
    this.dataListaTareas.paginator = this.paginacionTabla;
  }



}
