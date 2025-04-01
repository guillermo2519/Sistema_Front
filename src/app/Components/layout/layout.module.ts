import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutRoutingModule } from './layout-routing.module';
import { DashBoardComponent } from './Pages/dash-board/dash-board.component';
import { UsuarioComponent } from './Pages/usuario/usuario.component';

import { SharedModule } from '../../Reutilizable/shared/shared.module';
import { ModalUsuariosComponent } from './Modales/modal-usuarios/modal-usuarios.component';
import { ModalRolesComponent } from './Modales/modal-roles/modal-roles.component';
import { RolesComponent } from './Pages/roles/roles.component';
import { ControlDocumentalComponent } from './Pages/control-documental/control-documental.component';
import { ModalControlDocumentalComponent } from './Modales/modal-control-documental/modal-control-documental.component';
import { CDPendientesComponent } from './Pages/cdpendientes/cdpendientes.component';
import { CDListaMaestraComponent } from './Pages/cdlista-maestra/cdlista-maestra.component';

import { MatExpansionModule } from '@angular/material/expansion';
import { CDPendientesUserComponent } from './Pages/cdpendientes-user/cdpendientes-user.component';
import { ModalPendientesUserComponent } from './Modales/modal-pendientes-user/modal-pendientes-user.component';
import { TareasComponent } from './Pages/tareas/tareas.component';
import { ModalEditarTareasComponent } from './Modales/modal-editar-tareas/modal-editar-tareas.component';
import { TareasPendientesComponent } from './Pages/tareas-pendientes/tareas-pendientes.component';

@NgModule({
  declarations: [
    DashBoardComponent,
    UsuarioComponent,
    ModalUsuariosComponent,
    ModalRolesComponent,
    RolesComponent,
    ControlDocumentalComponent,
    ModalControlDocumentalComponent,
    CDPendientesComponent,
    CDListaMaestraComponent,
    CDPendientesUserComponent,
    ModalPendientesUserComponent,
    TareasComponent,
    ModalEditarTareasComponent,
    TareasPendientesComponent,
  ],
  imports: [
    CommonModule,
    LayoutRoutingModule,
    SharedModule
  ]
})
export class LayoutModule { }
