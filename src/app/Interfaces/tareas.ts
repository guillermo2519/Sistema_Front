export interface Tareas {
  id?: number;           
  title: string;         
  descripcion: string;   
  completed: boolean;    
  proceso: string;       
  aprueba: string;       
  createD_AT: Date;    
  updateD_AT: Date;    
  iD_USUARIO: number | null;   // Cambiar a 'number | null'
  iD_EMPRESA: number | null;   // Cambiar a 'number | null'
}
