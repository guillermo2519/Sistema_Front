import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ControlDocumentalService } from 'src/app/Services/control-documental.service';
import { ControlDocumental } from 'src/app/Interfaces/control-documental';
import { MatDialog } from '@angular/material/dialog';
import { ModalControlDocumentalComponent } from '../../Modales/modal-control-documental/modal-control-documental.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';

@Component({
  selector: 'app-control-documental',
  templateUrl: './control-documental.component.html',
  styleUrls: ['./control-documental.component.css']
})
export class ControlDocumentalComponent implements OnInit {

  @ViewChild('fileInput') fileInput!: ElementRef;
  selectedFile: File | null = null;
  documentForm!: FormGroup;  

  columnasTabla: string[] = ['motivO_ALTA', 'tipO_DOCUMENTO', 'codigo','nombrE_DOCUMENTO', 'proceso', 'aprueba' ,'archivO_URL', 'editar']; 
  dataInicio : ControlDocumental[] = [];
  dataListaDocumentos = new MatTableDataSource(this.dataInicio);
  @ViewChild(MatPaginator) paginacionTabla! : MatPaginator;

  selectedFileName: string | null = null; // Variable para almacenar el nombre del archivo
  
  constructor(
    private fb: FormBuilder,
    private _controlDocumentalService: ControlDocumentalService,
    private dialog : MatDialog,
    private _utilidadService : UtilidadService
  ) { }

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
          // Filtrar documentos por ID de empresa
          let documentosFiltrados = response.filter(
            (doc: ControlDocumental) => Number(doc.iD_EMPRESA) === Number(idEmpresa)
          );
  
          console.log("Documentos filtrados por ID de empresa:", documentosFiltrados);
  
          // Si el rol del usuario es Supervisor (4) o Director (5), mostrar documentos de acuerdo al proceso
          if (rol === 5) {
            if (procesoUsuario) {
              // Filtrar solo si el supervisor tiene un proceso asignado
              documentosFiltrados = documentosFiltrados.filter((doc: ControlDocumental) => {
                let procesoDoc = doc.proceso ? doc.proceso.toLowerCase().trim() : '';
                procesoDoc = procesoDoc.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Eliminar tildes
                return procesoDoc === procesoUsuario;
              });
            }
            console.log("Documentos filtrados por proceso para el Supervisor/Director:", documentosFiltrados);
            this.dataListaDocumentos.data = documentosFiltrados;
            return;
          }
  
          // Si el rol es operativo, filtrar por proceso también
          documentosFiltrados = documentosFiltrados.filter((doc: ControlDocumental) => {
            if (!doc.proceso) return false; // Si el documento no tiene proceso, no se muestra
  
            let procesoDoc = doc.proceso.toLowerCase().trim();
            procesoDoc = procesoDoc.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Eliminar tildes
  
            return procesoDoc === procesoUsuario;
          });
  
          console.log("Documentos filtrados por proceso:", documentosFiltrados);
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

    this.documentForm = this.fb.group({
      motivo: ['', Validators.required],
      tipo: ['', Validators.required],
      codigo: ['', Validators.required],
      retencion: ['', Validators.required],
      nombre: ['', Validators.required],
      proceso: ['', Validators.required],
      aprueba: ['', Validators.required],
    });
  }

  ngAfterViewInit(): void {
    this.dataListaDocumentos.paginator = this.paginacionTabla;
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

  guardarDocumento() {
    if (this.documentForm.valid) {
      const idUsuario = localStorage.getItem('idUsuario');
      const idEmpresa = localStorage.getItem('idEmpresa');
  
      // Convertir el archivo a base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64File = reader.result as string;
  
        const formData = {
          motivO_ALTA: this.documentForm.value.motivo,
          tipO_DOCUMENTO: this.documentForm.value.tipo,
          codigo: this.documentForm.value.codigo,
          tiempO_RETENCION: parseInt(this.documentForm.value.retencion, 10),
          nombrE_DOCUMENTO: this.documentForm.value.nombre,
          proceso: this.documentForm.value.proceso,
          aprueba: this.documentForm.value.aprueba,
          archivO_URL: base64File,
          ID_USUARIO: idUsuario,
          estado: this.documentForm.value.estado,
          id_EMPRESA: idEmpresa
        };
  
        // Crear documento y enviar notificación
        this._controlDocumentalService.crearDocumento(formData).subscribe(
          (response) => {
            this._utilidadService.mostrarAlerta("Documento guardado correctamente!", "Exito");
            this.obtenerDocumentos();  // Actualizar la tabla
            this.dataListaDocumentos._updateChangeSubscription();
          },
          (error) => {
            console.error("Error al guardar el documento o enviar la notificación:", error);
            this._utilidadService.mostrarAlerta("Hubo un problema al guardar el documento o enviar la notificación.", "error");
          }
        );
      };
  
      if (this.selectedFile) {
        reader.readAsDataURL(this.selectedFile);
      }
    } else {
      this._utilidadService.mostrarAlerta("Por favor, completa todos los campos.", "error");
    }
  }

  editarDocumento(documento: ControlDocumental) {
    this.dialog.open(ModalControlDocumentalComponent, {
      disableClose: true,
      data: documento
    }).afterClosed().subscribe(resultado => {
      if (resultado === "true") {
        this.obtenerDocumentos();  // Esto actualizará la tabla con los nuevos datos
      }
    });
  }

  delete(documental: ControlDocumental) {
    if (documental.id != null) {
      Swal.fire({
        title: '¿Desea eliminar el documento?',
        text: documental.nombrE_DOCUMENTO,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'No, volver'
      }).then((resultado) => {
        if (resultado.isConfirmed) {
          this._controlDocumentalService.elimininar(documental.id!).subscribe({
            next: (data) => {
              if (data.status) {
                this._utilidadService.mostrarAlerta("El documento ha sido eliminado", "Listo!");
  
                // Remover el documento eliminado del array
                const index = this.dataListaDocumentos.data.findIndex(item => item.id === documental.id);
                if (index >= 0) {
                  this.dataListaDocumentos.data.splice(index, 1);
  
                  // Actualizar tabla
                  this.dataListaDocumentos._updateChangeSubscription();
                }
              } else {
                this._utilidadService.mostrarAlerta("No se pudo eliminar el documento", "Error");
              }
            },
            error: (err) => {
              console.error("Error al eliminar:", err);
            }
          });
        }
      });
    } else {
      this._utilidadService.mostrarAlerta("Error: El documento no tiene un ID válido para eliminar", "Error");
    }
  }

  borrar() {
    this.documentForm.reset();
  }
}
