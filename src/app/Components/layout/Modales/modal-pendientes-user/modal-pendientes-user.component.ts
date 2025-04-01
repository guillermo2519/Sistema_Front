import { Component, OnInit, Inject } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ControlDocumentalService } from 'src/app/Services/control-documental.service';
import { ControlDocumental } from 'src/app/Interfaces/control-documental';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';
import { ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-modal-pendientes-user',
  templateUrl: './modal-pendientes-user.component.html',
  styleUrls: ['./modal-pendientes-user.component.css']
})
export class ModalPendientesUserComponent implements OnInit {

  formularioPendientesUser : FormGroup;
  tituloAccion : string = "Agregar";
  botonAccion : string = "Guardar";
  listaDocumentos : ControlDocumental[] = [];

  selectedFileName: string = ''; // Variable para almacenar el nombre del archivo
  selectedFile: File | null = null; // Archivo seleccionado

  archivoNombre: string = '';

  constructor(private modalCD: MatDialogRef<ModalPendientesUserComponent>,
      private dialog : MatDialog,
      private _controlService: ControlDocumentalService,
      private _utilidadService: UtilidadService,
      public dialogRef: MatDialogRef<ModalPendientesUserComponent>,
      @Inject(MAT_DIALOG_DATA) public dataDocumentos: ControlDocumental,
      private fb: FormBuilder) { 

         //Declarar campos del formulario
    this.formularioPendientesUser = this.fb.group({
      archivO_URL : ['', Validators.required],
      //esActivo : ['1', Validators.required]
      });

      if(this.dataDocumentos != null) {

        this.tituloAccion = "Editar",
        this.botonAccion = "Actualizar"
      }
  

      }

      ngOnInit(): void {
        console.log('Data Documentos en el ngOnInit:', this.dataDocumentos);
        if (this.dataDocumentos != null) {
          this.formularioPendientesUser.patchValue({
            archivO_URL: this.dataDocumentos.archivO_URL,           
          });
        }

     
      }
    
      guardarEditar_Usuario() {
        console.log("Botón Guardar presionado");
      
        if (!this.selectedFile) {
          console.log("No se ha seleccionado ningún archivo");
          this._utilidadService.mostrarAlerta("Por favor, seleccione un archivo", "Error");
          return;
        }
      
        if (!this.dataDocumentos || this.dataDocumentos.id === undefined) {
          console.log("El objeto dataDocumentos no es válido o el ID es undefined");
          this._utilidadService.mostrarAlerta("No se encontró el ID del documento", "Error");
          return;
        }
      
        // Convertir ID a número
        const documentoId = Number(this.dataDocumentos.id);
        if (isNaN(documentoId)) {
          console.log("El ID del documento no es un número válido");
          this._utilidadService.mostrarAlerta("El ID del documento no es válido", "Error");
          return;
        }
      
        console.log("Mostrando confirmación de Swal");
        Swal.fire({
          title: '¿Estás seguro?',
          text: "¿Deseas guardar los cambios?",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sí, guardar',
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          console.log("Respuesta de Swal:", result);
      
          if (result.isConfirmed) {
            console.log("Confirmación aceptada, llamando a actualizarArchivo");
      
            this._controlService.actualizarArchivo(documentoId, this.selectedFile!).subscribe({
              next: (response: any) => {
                console.log("Documento actualizado con éxito:", response);
                this._utilidadService.mostrarAlerta("El documento ha sido actualizado", "Éxito");
                this.dialogRef.close(true);
              },
              error: (err: any) => {
                console.log("Error al actualizar el documento:", err);
                this._utilidadService.mostrarAlerta("Error al actualizar el documento", "Error");
              }
            });
          } else {
            console.log("El usuario canceló la actualización.");
          }
        });
      }
      

onFileSelected(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    this.selectedFile = input.files[0]; // Guarda el archivo seleccionado
    this.selectedFileName = this.selectedFile.name; // Obtiene solo el nombre del archivo
  }
}


}
