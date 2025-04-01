export interface Empresa {
    id: number; // Corresponde a 'Id' en C#
    nombre: string; // Corresponde a 'Nombre' en C#
    direccion?: string; // 'string?' en C# se convierte en 'string | undefined'
    telefono?: string; // Igual que 'direccion'
    email?: string; // Igual que 'direccion'
  }
  