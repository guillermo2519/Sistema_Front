import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Menu } from 'src/app/Interfaces/menu';

import { MenuService } from 'src/app/Services/menu.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';

import { NotificacionesService } from 'src/app/Services/notificaciones.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  isExpanded = false; // Estado del submenú

  listaMenus: Menu[] = [];
  correoUsuario: string = '';
  rolUsuario: string = ''; 
  idRolUsuario: number = 0;

  listaNotificaciones: any[] = [];
  notificacionesNoLeidas: number = 0;

  constructor(private router: Router,
              private _menuService: MenuService,
              private _utilidadService: UtilidadService) { }

  ngOnInit(): void {
    const usuario = this._utilidadService.obtenerSesionUsuario();
    console.log('Usuario en sesión:', usuario);

    if (usuario != null) {
      this.correoUsuario = usuario.email;
      this.rolUsuario = usuario.nombre;
      this.idRolUsuario = usuario.rol;

      // Cargar los menús filtrados según el rol
      this._menuService.lista(usuario.idUsuario).subscribe({
        next: (data) => {
          if (data.status) {
            this.listaMenus = data.value;
          }
        },
        error: (e) => {
          console.error('Error al obtener menús:', e);
        }
      });
    }

    console.log('ID del usuario en sesión:', usuario.idUsuario);
  }


// Método para verificar si el menú debe mostrarse según el rol
shouldShowMenu(menu: string): boolean {
  // Si el rol es Admin (ID = 1), mostrar todos los menús
  if (this.idRolUsuario === 1) {
    return true;
  }

  // Si el rol es Director (ID = 3), Supervisor (ID = 4), o Operativo (ID = 6)
  // No mostrar Dashboard
  if (this.idRolUsuario === 3 || this.idRolUsuario === 4 || this.idRolUsuario === 6) {
    if (menu === 'dashboard') {
      return false;  // No mostrar el Dashboard
    }
  }

  // Mostrar menús según el rol para Control Documental
  if (this.idRolUsuario === 4) {  // Supervisor
    return menu === 'tareas' || menu === 'tareas/tareas-pendientes' || menu === 'tareas/cd-lista-maestra';
  }
  
  if (this.idRolUsuario === 6) {  // Operativo
    return menu === 'tareas' || menu === 'tareas/tareas-pendientes' || menu === 'tareas/cd-lista-maestra';
  }
  
  if (this.idRolUsuario === 3) {  // Director
    return menu === 'tareas' || menu === 'tareas/tareas-pendientes' || menu === 'tareas/cd-lista-maestra';
  }

  return false;  // Para cualquier otro rol no se muestra el menú
}


  cerrarSesion(): void {
    this._utilidadService.eliminarSesionUsuario();
    this.router.navigate(['login']);
  }

  toggleExpansion(event: Event): void {
    event.stopPropagation(); // Evita la propagación del clic al ítem principal
    this.isExpanded = !this.isExpanded;
  }

  navigateTo(route: string): void {
    this.router.navigate([`/pages/${route}`]);
  }

  verNotificaciones(): void {
    this.router.navigate(['/pages/notificaciones']); // Redirigir a la página de notificaciones
  }
}
