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
import { ModalPendientesUserComponent } from '../../Modales/modal-pendientes-user/modal-pendientes-user.component';

@Component({
  selector: 'app-cdpendientes-user',
  templateUrl: './cdpendientes-user.component.html',
  styleUrls: ['./cdpendientes-user.component.css']
})
export class CDPendientesUserComponent implements OnInit {

  @ViewChild('fileInput') fileInput!: ElementRef;
  selectedFile: File | null = null;
  formularioDocumental : FormGroup;

  columnasTabla: string[] = ['codigo', 'proceso', 'nombrE_DOCUMENTO', 'fechA_CREACION', 'dias', 'estado', 'comentarios', 'archivO_URL', 'editar', 'guardar'];


  dataInicio : ControlDocumental[] = [];
  dataListaDocumentos = new MatTableDataSource(this.dataInicio);
  @ViewChild(MatPaginator) paginacionTabla! : MatPaginator;

  selectedFileName: string | null = null; // Variable para almacenar el nombre del archivo  


  constructor(
    private fb: FormBuilder,
    private _controlDocumentalService: ControlDocumentalService,
    private dialog : MatDialog,
    private _utilidadService : UtilidadService
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
      estado : ['', Validators.required]
    });
    
  }

  obtenerDocumentos() {
    const usuario = this._utilidadService.obtenerSesionUsuario();
  
    if (!usuario) {
      this._utilidadService.mostrarAlerta('No se pudo obtener la sesión del usuario', 'Error');
      return;
    }
  
    const idEmpresa = usuario.idEmpresa;
    const rol = usuario.rol;
    let procesoUsuario = usuario.proceso ? usuario.proceso.toLowerCase().trim() : '';
  
    // Eliminar tildes en el proceso del usuario
    procesoUsuario = procesoUsuario.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
    console.log("ID Empresa:", idEmpresa);
    console.log("Rol del usuario:", rol);
    console.log("Proceso asignado al usuario (sin tildes):", procesoUsuario);
  
    this._controlDocumentalService.lista().subscribe({
      next: (response: any) => {
        console.log("Datos obtenidos de la API (sin procesar):", response);
  
        if (Array.isArray(response)) {
          let documentosFiltrados = response.filter(
            (doc: ControlDocumental) => Number(doc.iD_EMPRESA) === Number(idEmpresa)
          );
  
          console.log("Procesos en los documentos:", documentosFiltrados.map(d => d.proceso));
  
          // Si el usuario tiene rol de Director (5) o Supervisor (4), filtrar por el proceso asignado
          if (rol === 4 || rol === 5) {
            console.log("El usuario tiene rol de Supervisor o Director, filtrando por proceso.");
  
            // Filtrar documentos solo para el proceso asignado al supervisor
            documentosFiltrados = documentosFiltrados.filter((doc: ControlDocumental) => {
              let procesoDoc = doc.proceso ? doc.proceso.toLowerCase().trim() : '';
              procesoDoc = procesoDoc.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Quitar tildes
              return procesoDoc === procesoUsuario;
            });
          }

          documentosFiltrados = documentosFiltrados.filter((doc: ControlDocumental) => doc.estado === 'Modificar');

  
          console.log("Documentos filtrados correctamente:", documentosFiltrados);
          this.dataListaDocumentos.data = documentosFiltrados;
        } else {
          this._utilidadService.mostrarAlerta('No se encontraron registros', 'Error');
        }
      },
      error: (err) => {
        console.error("Error al obtener documentos:", err);
        this._utilidadService.mostrarAlerta('Error al cargar documentos', 'Error');
      }
    });
  }
  
  
   // Función para calcular los días desde la fecha de creación
   calcularDias(fechaCreacion: Date, estado: string): string | number {
    if (estado === 'Aprobar' || estado === 'Modificar') {
      return 'ha sido modificado'; // Mensaje si el estado es "Aprobar" o "Modificar"
    }

    if (!fechaCreacion || estado !== 'Activo') {
      return 0; // Si no hay fecha o el estado no es "Activo", no calculamos los días
    }
    const fechaActual = new Date();
    const fechaDeCreacion = new Date(fechaCreacion);
    const diferenciaEnTiempo = fechaActual.getTime() - fechaDeCreacion.getTime();
    return Math.floor(diferenciaEnTiempo / (1000 * 3600 * 24)); // Convertir el tiempo a días
  }

  isNumber(value: any): boolean {
    return typeof value === 'number';
  }
  

  ngOnInit(): void {
    this.obtenerDocumentos();
    this.formularioDocumental = this.fb.group({
      motivo: ['', Validators.required],
      tipo: ['', Validators.required],
      codigo: ['', Validators.required],
      retencion: ['', Validators.required],
      nombre: ['', Validators.required],
      proceso: ['', Validators.required],
      aprueba: ['', Validators.required],
      fecheInicio: ['', Validators.required],
      estado: ['', Validators.required]
    });
  }

  ngAfterViewInit(): void {
    this.dataListaDocumentos.paginator = this.paginacionTabla;
  }

  getClassForDias(dias: string | number, estado: string): string {
    if (estado !== 'Activo' || typeof dias !== 'number') return 'default-cell'; // Clase por defecto si no es Activo o el valor no es numérico
  
    if (dias === 0) return 'green-cell'; // Verde si los días son 0
    if (dias >= 1 && dias <= 3) return 'yellow-cell'; // Amarillo si están entre 1 y 3
    if (dias >= 4) return 'red-cell'; // Rojo si son 4 o más
    return 'default-cell'; // Clase por defecto si no se cumple ninguna de las anteriores
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.selectedFileName = this.selectedFile.name; // Almacenar solo el nombre del archivo
      console.log('Nombre del archivo seleccionado:', this.selectedFileName);
    }
  }

  verDocumento(base64: string) {
    const fileType = this.obtenerTipoArchivo(base64);
    const fileBlob = this.base64ToBlob(base64, fileType);
    const fileURL = URL.createObjectURL(fileBlob);
  
    if (fileType === 'application/pdf') {
      // Si es PDF, abrir en una nueva pestaña
      window.open(fileURL, '_blank');
    } else {
      // Si es Word o Excel, forzar la descarga
      const a = document.createElement('a');
      a.href = fileURL;
      a.download = `documento.${this.obtenerExtension(fileType)}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }

  obtenerTipoArchivo(base64: string): string {
    if (base64.startsWith('data:application/pdf')) {
      return 'application/pdf';
    } else if (base64.startsWith('data:application/msword')) {
      return 'application/msword';
    } else if (base64.startsWith('data:application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
      return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'; // DOCX
    } else if (base64.startsWith('data:application/vnd.ms-excel')) {
      return 'application/vnd.ms-excel';
    } else if (base64.startsWith('data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
      return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'; // XLSX
    } else if (base64.startsWith('data:application/vnd.ms-powerpoint')) {
      return 'application/vnd.ms-powerpoint'; // PPT
    } else if (base64.startsWith('data:application/vnd.openxmlformats-officedocument.presentationml.presentation')) {
      return 'application/vnd.openxmlformats-officedocument.presentationml.presentation'; // PPTX
    }
    return 'application/octet-stream';
  }
  
  obtenerExtension(mimeType: string): string {
    switch (mimeType) {
      case 'application/pdf': return 'pdf';
      case 'application/msword': return 'doc';
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': return 'docx';
      case 'application/vnd.ms-excel': return 'xls';
      case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': return 'xlsx';
      case 'application/vnd.ms-powerpoint': return 'ppt';
      case 'application/vnd.openxmlformats-officedocument.presentationml.presentation': return 'pptx';
      default: return 'txt';
    }
  }
  
  base64ToBlob(base64: string, mimeType: string) {
    const byteCharacters = atob(base64.split(',')[1]);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset++) {
      const byte = byteCharacters.charCodeAt(offset);
      byteArrays.push(byte);
    }
    return new Blob([new Uint8Array(byteArrays)], { type: mimeType });
  }

  editarDocumento(documento: ControlDocumental) {
    this.dialog.open(ModalPendientesUserComponent, {
      disableClose: true,
      data: documento
    }).afterClosed().subscribe(resultado => {
      console.log("Resultado del modal:", resultado); 
      if (resultado === "true") {
        this.obtenerDocumentos();
        this.dataListaDocumentos._updateChangeSubscription(); // Asegura que Angular detecte los cambios
      }
    });
  }
  
  
 guardarCambios(element: any) {
  if (element.estado === 'Modificar') {  
    const documentoActualizado = {
      ...element, 
      estado: 'Pendiente', // Cambiar solo el estado del documento actual
    };

    console.log('Documento a actualizar:', documentoActualizado);

    this._controlDocumentalService.editarEstado(documentoActualizado).subscribe({
      next: (response) => {
        console.log("Documento actualizado con éxito:", response);
        this._utilidadService.mostrarAlerta("Documento actualizado con éxito", "Exito");

        // Filtrar solo los documentos que siguen en "Modificar" para actualizar la tabla
        this.dataListaDocumentos.data = this.dataListaDocumentos.data.filter(doc => doc.codigo !== element.codigo);

        this.dataListaDocumentos._updateChangeSubscription(); // Asegura que la tabla se actualice
      },
      error: (err) => {
        console.error("Error al actualizar documento:", err);
        this._utilidadService.mostrarAlerta("Hubo un error al actualizar el documento", "Error");
      }
    });
  }
}

  

  
}