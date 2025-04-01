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
  selector: 'app-modal-control-documental',
  templateUrl: './modal-control-documental.component.html',
  styleUrls: ['./modal-control-documental.component.css']
})
export class ModalControlDocumentalComponent implements OnInit {


  formularioDocumental : FormGroup;
  tituloAccion : string = "Agregar";
  botonAccion : string = "Guardar";
  listaDocumentos : ControlDocumental[] = [];

  constructor(
    private modalCD: MatDialogRef<ModalControlDocumentalComponent>,
    private dialog : MatDialog,
    private _controlService: ControlDocumentalService,
    private _utilidadService: UtilidadService,
    public dialogRef: MatDialogRef<ModalControlDocumentalComponent>,
    @Inject(MAT_DIALOG_DATA) public dataDocumentos: ControlDocumental,
    private fb: FormBuilder
  ) { 

    //Declarar campos del formulario
    this.formularioDocumental = this.fb.group({
      motivO_ALTA : ['', Validators.required],
      tipO_DOCUMENTO : ['', Validators.required],
      codigo : ['', Validators.required],
      tiempO_RETENCION : ['', Validators.required],
      nombrE_DOCUMENTO : ['', Validators.required],
      proceso : ['', Validators.required],
      aprueba : ['', Validators.required],
      archivO_URL : ['', Validators.required],
      //esActivo : ['1', Validators.required]
    });
    
    if(this.dataDocumentos != null) {

      this.tituloAccion = "Editar",
      this.botonAccion = "Actualizar"
    }

  }

  

  ngOnInit(): void {
    console.log('Data Documentos en el ngOnInit:', this.dataDocumentos); // Verifica si tiene ID
    if (this.dataDocumentos != null) {
      this.formularioDocumental.patchValue({
        motivO_ALTA: this.dataDocumentos.motivO_ALTA,
        tipO_DOCUMENTO: this.dataDocumentos.tipO_DOCUMENTO,
        codigo: this.dataDocumentos.codigo,
        tiempO_RETENCION: this.dataDocumentos?.tiempO_RETENCION?.toString(),
        nombrE_DOCUMENTO: this.dataDocumentos.nombrE_DOCUMENTO,
        proceso: this.dataDocumentos.proceso,
        aprueba: this.dataDocumentos.aprueba,
        archivO_URL: this.dataDocumentos.archivO_URL,
        
      });
    }
  }



   guardarEditar_Usuario() {
    if (this.formularioDocumental.valid) {
      const _controDocumental : ControlDocumental = {
        id : this.dataDocumentos == null ? 0 : this.dataDocumentos.id,
       motivO_ALTA : this.formularioDocumental.value.motivO_ALTA,
       tipO_DOCUMENTO : this.formularioDocumental.value.tipO_DOCUMENTO,
       codigo : this.formularioDocumental.value.codigo,
       tiempO_RETENCION : this.formularioDocumental.value.tiempO_RETENCION,
       nombrE_DOCUMENTO : this.formularioDocumental.value.nombrE_DOCUMENTO,
       proceso : this.formularioDocumental.value.proceso,
       aprueba : this.formularioDocumental.value.aprueba,
       archivO_URL : this.formularioDocumental.value.archivO_URL, 
       estado : this.formularioDocumental.value.estado,
      }
  
      this._controlService.editar(_controDocumental).subscribe({
        next: (response) => {
          this._utilidadService.mostrarAlerta("El usuario fue editado","Exito");
          this.dialogRef.close('true');  // Cerramos el modal y notificamos que el documento fue actualizado
        },
        error: (err) => {
          this._utilidadService.mostrarAlerta("Hubo un problema al actualizar el documento.","error");
        }
      });
    } else {
      this._utilidadService.mostrarAlerta("No se pudo editar el usuario","Error");
    }
  }
  
  
  
}
