import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ControlDocumentalService } from 'src/app/Services/control-documental.service';
import { ControlDocumental } from 'src/app/Interfaces/control-documental';
import { MatDialog } from '@angular/material/dialog';
import { ModalControlDocumentalComponent } from '../../Modales/modal-control-documental/modal-control-documental.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';


@Component({
  selector: 'app-cdlista-maestra',
  templateUrl: './cdlista-maestra.component.html',
  styleUrls: ['./cdlista-maestra.component.css']
})
export class CDListaMaestraComponent implements OnInit {

  @ViewChild('fileInput') fileInput!: ElementRef;
  selectedFile: File | null = null;
  tablaLista : FormGroup;

  columnasTabla: string[] = ['codigo', 'nombrE_DOCUMENTO', 'proceso' ,'fechA_CREACION', 'tiempO_RETENCION', 'archivO_URL']; 
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
     this.tablaLista = this.fb.group({
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
  
    procesoUsuario = procesoUsuario.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
    console.log("ID Empresa:", idEmpresa);
    console.log("Rol del usuario:", rol);
    console.log("Proceso asignado al usuario (sin tildes):", procesoUsuario);
  
    this._controlDocumentalService.lista().subscribe({
      next: (response: any) => {
        console.log("Datos obtenidos de la API (sin procesar):", response);
  
        if (Array.isArray(response)) {
          // Filtrar los documentos según el idEmpresa
          let documentosFiltrados = response.filter(
            (doc: ControlDocumental) => Number(doc.iD_EMPRESA) === Number(idEmpresa)
          );
  
          console.log("Procesos en los documentos:", documentosFiltrados.map(d => d.proceso));
  
          // Filtrar por el estado "Aprobar"
          documentosFiltrados = documentosFiltrados.filter((doc: ControlDocumental) => doc.estado === 'Aprobar');
  
          // Si el usuario tiene rol de Director (5) o Supervisor (4), mostrar todos los documentos
          if (rol === 4 || rol === 5) {
            console.log("El usuario tiene rol de Supervisor o Director, mostrando todos los documentos.");
            this.dataListaDocumentos.data = documentosFiltrados;
            return;
          }
  
          // Filtrar documentos solo para roles que requieren proceso
          documentosFiltrados = documentosFiltrados.filter((doc: ControlDocumental) => {
            if (!doc.proceso) return false;  // Si el documento no tiene proceso, no se muestra
  
            let procesoDoc = doc.proceso.toLowerCase().trim();
            procesoDoc = procesoDoc.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Quitar tildes
  
            return procesoDoc === procesoUsuario;
          });
  
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
  
  
  

  ngOnInit(): void {
    this.obtenerDocumentos();
    this.tablaLista = this.fb.group({
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
  
    // Abre el archivo en una nueva ventana
    window.open(fileURL, '_blank');
  }

  obtenerTipoArchivo(base64: string): string {
    // Detecta el tipo de archivo según el prefijo de base64
    if (base64.startsWith('data:application/pdf')) {
      return 'application/pdf';
    } else if (base64.startsWith('data:application/msword')) {
      return 'application/msword';
    }
    // Agregar otros tipos de archivos según sea necesario
    return 'application/octet-stream';
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

  exportarTablaExcel() {
    const datos = this.dataListaDocumentos.data.map(element => ({
      ID: element.id,
      Código: element.codigo,
      Nombre: element.nombrE_DOCUMENTO,
      'Fecha de Solicitud': element.fechA_CREACION,
      'Tiempo de Retención': element.tiempO_RETENCION
    }));
  
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(datos);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Documentos');
  
    const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, 'Lista_Documentos.xlsx');
  }
  
  


}
