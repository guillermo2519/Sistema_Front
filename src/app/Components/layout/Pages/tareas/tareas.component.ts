import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { ModalControlDocumentalComponent } from '../../Modales/modal-control-documental/modal-control-documental.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';
import { TareasService } from 'src/app/Services/tareas.service';
import { Tareas } from 'src/app/Interfaces/tareas';
import { ModalEditarTareasComponent } from '../../Modales/modal-editar-tareas/modal-editar-tareas.component';


@Component({
  selector: 'app-tareas',
  templateUrl: './tareas.component.html',
  styleUrls: ['./tareas.component.css']
})
export class TareasComponent implements OnInit {

  @ViewChild('fileInput') fileInput!: ElementRef;
  selectedFile: File | null = null;
  tareasForm!: FormGroup;  


    columnasTabla: string[] = ['title', 'descripcion', 'completed', 'proceso', 'aprueba', 'createD_AT', 'updateD_AT', 'editar'];
    dataInicio : Tareas[] = [];
    dataListaTareas = new MatTableDataSource(this.dataInicio);
    @ViewChild(MatPaginator) paginacionTabla! : MatPaginator;
  

    obtenerTareas() {
      const usuario = this._utilidadService.obtenerSesionUsuario();
    
      if (!usuario) {
        this._utilidadService.mostrarAlerta('No se pudo obtener la sesión del usuario', 'Error');
        return;
      }
    
      this._TareasService.lista().subscribe({
        next: (response: any) => {
          console.log("Datos obtenidos de la API:", response);
    
          if (Array.isArray(response) && response.length > 0) {
            // Asegúrate de que 'COMPLETED' sea un booleano (true/false)
            response.forEach((task: any) => {
              // Verifica y convierte 'COMPLETED' a un booleano
              task.completed = task.completed === 1 || task.completed === true; // Convierte a true si es 1 o true
              console.log(`COMPLETED for task ${task.title}:`, task.completed); // Verifica en la consola
            });
    
            this.dataListaTareas.data = response;
            this.dataListaTareas._updateChangeSubscription();
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
    
    
    
  constructor(
    private fb: FormBuilder,
    private _TareasService: TareasService,
    private dialog : MatDialog,
    private _utilidadService : UtilidadService
  ) { }



  ngOnInit(): void {

    this.obtenerTareas();

    this.tareasForm = this.fb.group({
      TITLE: ['', Validators.required],        
      DESCRIPCION: ['', Validators.required],  
      COMPLETED: [false, Validators.required],  
      PROCESO: ['', Validators.required],       
      APRUEBA: ['', Validators.required],       
    });
  }



  ngAfterViewInit(): void {
    this.dataListaTareas.paginator = this.paginacionTabla;
  }

  guardarTarea() {
    if (this.tareasForm.valid) {
      const idUsuario = localStorage.getItem('idUsuario');
      const idEmpresa = localStorage.getItem('idEmpresa');
    
      const idUsuarioNumber = idUsuario ? parseInt(idUsuario, 10) : null;
      const idEmpresaNumber = idEmpresa ? parseInt(idEmpresa, 10) : null;
    
      const formData = { 
        title: this.tareasForm.value.TITLE,
        descripcion: this.tareasForm.value.DESCRIPCION,
        completed: this.tareasForm.value.COMPLETED === 'true' ? true : false,
        proceso: this.tareasForm.value.PROCESO,
        aprueba: this.tareasForm.value.APRUEBA,
        createD_AT: new Date(),
        updateD_AT: new Date(),
        iD_USUARIO: idUsuarioNumber,  
        iD_EMPRESA: idEmpresaNumber  
      };

    console.log("Objeto enviado al backend:", formData);
  
    // Enviar la tarea al servicio correspondiente
    this._TareasService.crearTarea(formData).subscribe(
      (response) => {
        this._utilidadService.mostrarAlerta("Tarea guardada correctamente!", "Éxito");

        this.obtenerTareas();  
  
        this.tareasForm.reset();
      },
      (error) => {
        console.error("Error al guardar la tarea:", error);
        this._utilidadService.mostrarAlerta("Hubo un problema al guardar la tarea.", "Error");
      }
    );
  } else {
    this._utilidadService.mostrarAlerta("Por favor, completa todos los campos.", "Error");
  }
}
  
  editarTarea(tarea: Tareas) {
    this.dialog.open(ModalEditarTareasComponent, {
      disableClose: true,
      data: tarea
    }).afterClosed().subscribe(resultado => {
      if (resultado === true) { 
        this.obtenerTareas();  
      }
    });
  }
  
  delete(tarea: Tareas) {
    if (tarea.id != null) {
      Swal.fire({
        title: '¿Desea eliminar la tarea?',
        text: tarea.title,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'No, volver'
      }).then((resultado) => {
        if (resultado.isConfirmed) {
          this._TareasService.elimininar(tarea.id!).subscribe({
            next: () => {
              this._utilidadService.mostrarAlerta("La tarea ha sido eliminada", "Listo!");
  
              // Recargar la lista de tareas
              this.obtenerTareas();
            },
            error: (err) => {
              console.error("Error al eliminar:", err);
              this._utilidadService.mostrarAlerta("Error al eliminar la tarea", "Error");
            }
          });
        }
      });
    } else {
      this._utilidadService.mostrarAlerta("Error: La tarea no tiene un ID válido para eliminar", "Error");
    }
  }
  
  
  
}
