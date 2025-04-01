import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LayoutComponent } from './layout.component';
import { DashBoardComponent } from './Pages/dash-board/dash-board.component';
import { UsuarioComponent } from './Pages/usuario/usuario.component';
import { CDListaMaestraComponent } from './Pages/cdlista-maestra/cdlista-maestra.component';
import { TareasComponent } from './Pages/tareas/tareas.component';
import { TareasPendientesComponent } from './Pages/tareas-pendientes/tareas-pendientes.component';

const routes: Routes = [{
  path: '',
  component : LayoutComponent,
  children : [
    { path: 'tareas', component: TareasComponent},
    { path: 'tareas/tareas-pendientes', component: TareasPendientesComponent },
    { path: 'tareas/cd-lista-maestra', component: CDListaMaestraComponent },
  ]
}];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
