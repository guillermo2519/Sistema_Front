export interface ControlDocumental {
    id?: number;
    motivO_ALTA?: string;
    tipO_DOCUMENTO?: string;
    codigo?: string;
    tiempO_RETENCION?: number;
    nombrE_DOCUMENTO?: string;
    proceso?: string;
    aprueba?: string;
    archivO_URL?: string;
    idDocumento?: string;
    fechA_CREACION?: Date;
    fechA_ACTUALIZACION?: Date;
    estado?: string;
    dias?: number; // Campo para los días calculados
    iD_EMPRESA?: string; // Cambiado a coincidir con la API
  }
  