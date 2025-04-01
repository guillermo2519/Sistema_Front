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

@Component({
  selector: 'app-cdpendientes',
  templateUrl: './cdpendientes.component.html',
  styleUrls: ['./cdpendientes.component.css']
})
export class CDPendientesComponent implements OnInit {

  @ViewChild('fileInput') fileInput!: ElementRef;
  selectedFile: File | null = null;
  formularioDocumental : FormGroup;

  columnasTabla: string[] = ['codigo', 'proceso' ,'tipO_DOCUMENTO', 'fechA_CREACION', 'tiempO_RETENCION','estado', 'archivO_URL' ,'comentarios']; 
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
      //esActivo : ['1', Validators.required]
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
  
    this._controlDocumentalService.lista().subscribe({
      next: (response: any) => {
        if (Array.isArray(response)) {
          let documentosFiltrados = response.filter(
            (doc: ControlDocumental) => Number(doc.iD_EMPRESA) === Number(idEmpresa)
          );
  
          if (rol === 4 || rol === 5) {
            if (procesoUsuario) {
              documentosFiltrados = documentosFiltrados.filter((doc: ControlDocumental) => {
                let procesoDoc = doc.proceso ? doc.proceso.toLowerCase().trim() : '';
                procesoDoc = procesoDoc.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); 
                return procesoDoc === procesoUsuario;
              });
            }
          } else {
            documentosFiltrados = documentosFiltrados.filter((doc: ControlDocumental) => {
              let procesoDoc = doc.proceso ? doc.proceso.toLowerCase().trim() : '';
              procesoDoc = procesoDoc.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); 
              return procesoDoc === procesoUsuario;
            });
          }
  
          // Filtrar documentos con estado distinto de "Modificar" y "Aprobar"
          documentosFiltrados = documentosFiltrados.filter((doc: ControlDocumental) => 
            doc.estado !== 'Modificar' && doc.estado !== 'Aprobar'
          );
  
          // **Calcular los días de retención correctamente**
          documentosFiltrados = documentosFiltrados.map((doc) => ({
            ...doc,
            tiempO_RETENCION: this.calcularDiasRetencion(doc.fechA_CREACION)
          }));
  
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

  guardarCambios() {
    const documentosActualizados = this.dataListaDocumentos.data.map(element => {
      if (element.estado === 'Modificar') {  // Solo cambiar los que tienen el estado a "Modificar"
        return {
          ...element, 
          estado: 'Modificar',
        };
      }
      return element;
    });

    documentosActualizados.forEach((documento) => {
      console.log('Documento a actualizar:', documento);
      this._controlDocumentalService.editarEstado(documento).subscribe({
        next: (response) => {
          console.log("Documento actualizado con éxito:", response);
          this._utilidadService.mostrarAlerta("Documento actualizado con éxito", "Exito");
          this.obtenerDocumentos(); // Actualiza la lista después de los cambios
        },
        error: (err) => {
          console.error("Error al actualizar documento:", err);
          this._utilidadService.mostrarAlerta("Hubo un error al actualizar el documento", "Error");
        }
      });
    });
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
  calcularDiasRetencion(fechaCreacion: string): number {
    if (!fechaCreacion) return 0;
  
    const fechaCreacionDate = new Date(fechaCreacion);
    const fechaActual = new Date();
  
    // Calcular la diferencia en milisegundos y convertirla a días
    const diferenciaTiempo = fechaActual.getTime() - fechaCreacionDate.getTime();
    const diasTranscurridos = Math.floor(diferenciaTiempo / (1000 * 60 * 60 * 24));
  
    return diasTranscurridos >= 0 ? diasTranscurridos : 0;
  }

  getRetentionClass(dias: number): string {
    if (dias <= 1) {
      return 'retencion-verde';
    } else if (dias >= 3 && dias <= 4) {
      return 'retencion-amarillo';
    } else if (dias >= 5) {
      return 'retencion-rojo';
    }
    return '';
  }
  
  
}
