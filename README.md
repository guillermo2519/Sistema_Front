# Sistema de Gestión de Calidad - Front-End

Este es el front-end de un sistema de gestión de tareas desarrollado con Angular. El sistema tareas. Se conecta a un back-end desarrollado con .NET Core para realizar operaciones de lectura, escritura y modificación de documentos.

## Descripción

Este front-end está diseñado para ser un sistema interactivo y fácil de usar.

### **Credenciales de prueba**
Para acceder al sistema, puedes usar las siguientes credenciales:

- **Correo:** `oper@gmail.com`  
- **Contraseña:** `12345`

## Instrucciones para ejecutar el proyecto

1. **Clona el repositorio del front-end**:
   Si aún no has clonado el repositorio, ejecuta el siguiente comando en tu terminal:

   ```bash
   git clone https://github.com/tu-usuario/tu-repositorio-front-end.git


2. **Instala las dependencias: Navega al directorio del proyecto clonado e instala las dependencias necesarias usando npm:

   ```bash
   cd tu-repositorio-front-enp
   npm install

3. **Configura el entorno, asegúrate de que las URLs de la API del back-end estén configuradas correctamente. En el archivo src/environments/environment.ts, actualiza las rutas de la API para que apunten al back-end.

        export const environment = {
          production: false,
           apiUrl: 'https:'
           };


4. **Ejecuta la aplicación en modo desarrollo, para iniciar la aplicación en modo desarrollo y ver los cambios en tiempo real, ejecuta:

        ng serve --o


  

## Dependencias necesarias
Este proyecto depende de las siguientes herramientas y tecnologías:

Node.js: Necesario para ejecutar Angular y sus dependencias. Se recomienda instalar la versión LTS de Node.js.

Angular CLI: Utilizado para compilar, servir y construir el proyecto.

RxJS: Biblioteca para programación reactiva, utilizada para manejar los datos asincrónicos de la API.

Bootstrap (opcional): Utilizado para el diseño responsivo y los estilos.

Instala las dependencias ejecutando npm install (esto instalará Angular y otras dependencias listadas en package.json).

## Explicación del Sistema

Explicación del Sistema
Este sistema está diseñado para la gestión de tareas, permitiendo que los usuarios interactúen con ellas de manera sencilla y eficiente.

Funcionalidades principales
Gestión de tareas
Los usuarios pueden crear nuevas tareas.

Se pueden modificar las tareas existentes.

Es posible eliminar tareas cuando ya no sean necesarias.

Autenticación de usuarios
El sistema cuenta con un inicio de sesión donde los usuarios deben ingresar sus credenciales para acceder.

Interacción con el back-end
El front-end consume una API RESTful construida con .NET Core.

Realiza peticiones HTTP para manejar la autenticación y la gestión de tareas.

Interfaz de usuario
Utiliza Angular para ofrecer una interfaz de usuario dinámica y fluida.

El diseño es responsivo y está optimizado para dispositivos móviles y de escritorio.
