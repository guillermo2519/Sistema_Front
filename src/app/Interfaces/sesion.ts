export interface Sesion {
    idUsuario: number;
    Nombre: string;
    Email: string;
    Descripcion: string;
    rol: number; // ID del rol como número
    idEmpresa: number; // Agregar el campo idEmpresa
    proceso: string;
}
