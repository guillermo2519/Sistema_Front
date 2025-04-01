import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Tareas } from 'src/app/Interfaces/tareas';
import { TareasService } from 'src/app/Services/tareas.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';

@Component({
  selector: 'app-modal-editar-tareas',
  templateUrl: './modal-editar-tareas.component.html',
  styleUrls: ['./modal-editar-tareas.component.css']
})
export class ModalEditarTareasComponent implements OnInit {

  formularioTarea: FormGroup;
  tituloAccion: string = "Agregar";
  botonAccion: string = "Guardar";

  constructor(
    private dialogRef: MatDialogRef<ModalEditarTareasComponent>,
    private _tareasService: TareasService,
    private _utilidadService: UtilidadService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public dataTareas: Tareas
  ) {     
    // Inicialización del formulario con validaciones
    this.formularioTarea = this.fb.group({
      title: ['', Validators.required],
      descripcion: ['', Validators.required],
      COMPLETED: [false, Validators.required],  // Checkbox o dropdown de estado
      proceso: ['', Validators.required],
      aprueba: ['', Validators.required],
      iD_USUARIO: [null, Validators.required],
      iD_EMPRESA: [null, Validators.required]
    });

    if (this.dataTareas != null) {
      this.tituloAccion = "Editar";
      this.botonAccion = "Actualizar";
    }
  }

  ngOnInit(): void {
    console.log('Datos de la tarea en ngOnInit:', this.dataTareas);
  
    if (this.dataTareas != null) {
      // Si COMPLETED ya es booleano, solo asigna el valor tal cual
      const completedValue = this.dataTareas.completed;
  
      this.formularioTarea.patchValue({
        title: this.dataTareas.title,
        descripcion: this.dataTareas.descripcion,
        COMPLETED: completedValue,  // No es necesario convertirlo
        proceso: this.dataTareas.proceso,
        aprueba: this.dataTareas.aprueba,
        iD_USUARIO: this.dataTareas.iD_USUARIO,
        iD_EMPRESA: this.dataTareas.iD_EMPRESA
      });
    }
  }
  

  guardarEditar_Tarea() {
    if (this.formularioTarea.valid) {
      // Utilizamos "id" (minúsculas) si existe, de lo contrario usamos "ID"
      const tareaId = this.dataTareas.id || this.dataTareas.id || 0;
      
      if (tareaId === 0) {
        this._utilidadService.mostrarAlerta("No se ha proporcionado un ID válido para la tarea.", "Error");
        return;
      }
  
      const tarea: Tareas = {
        id: tareaId,
        title: this.formularioTarea.value.title,
        descripcion: this.formularioTarea.value.descripcion,
        completed: Boolean(this.formularioTarea.value.COMPLETED),
        proceso: this.formularioTarea.value.proceso,
        aprueba: this.formularioTarea.value.aprueba,
        createD_AT: this.dataTareas?.createD_AT || new Date(),
        updateD_AT: new Date(),
        iD_USUARIO: this.formularioTarea.value.iD_USUARIO,
        iD_EMPRESA: this.formularioTarea.value.iD_EMPRESA
      };
  
      this._tareasService.editar(tarea).subscribe({
        next: () => {
          this._utilidadService.mostrarAlerta("La tarea fue actualizada correctamente", "Exito");
          this.dialogRef.close(true);
        },
        error: () => {
          this._utilidadService.mostrarAlerta("Hubo un problema al actualizar la tarea.", "Error");
        }
      });
    } else {
      this._utilidadService.mostrarAlerta("Por favor, complete todos los campos obligatorios", "Error");
    }
  }
  



}
