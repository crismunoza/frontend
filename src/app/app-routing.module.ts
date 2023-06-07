import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "../app/components/pages/login/login.component";
import { ResetpassComponent } from './components/pages/resetpass/resetpass.component';
import {PagesError404Component} from "../app/components/pages/pages-error404/pages-error404.component";
import {PerfilComponent} from "../app/components/pages/perfil/perfil.component";
import {InicioComponent} from "../app/components/pages/inicio/inicio.component";
import { InicioGeneralComponent } from './components/inicio-general/inicio-general.component';

import { AuthGuard } from './utils/auth.guard';
import { RoleGuard } from './utils/role.guard';
const routes: Routes = [
  {
  path:'registro',
  loadChildren: () => import('./modules/Registro/registro.module').then(m => m.RegistroModule)
  },
  {path:'admin'
  ,loadChildren:()=>import('./modules/Representante/representante.module').then(m=>m.RepresentanteModule),canActivate:[AuthGuard,RoleGuard],
  data: { role: 'admin' }
  },
  {path: 'Vecino'
  ,loadChildren:()=>import('./modules/Vecino/vecino.module').then(m=>m.VecinoModule),canActivate:[AuthGuard,RoleGuard]
  ,data:{role : 'vecino'}
  },
  {path: 'login', component: LoginComponent},
  {path: 'resetpass', component: ResetpassComponent},
  {path: 'inicio', component: InicioComponent,canActivate:[AuthGuard]
  },

  {path: 'pages-error404', component: PagesError404Component},
  {path: 'perfil', component: PerfilComponent, canActivate:[AuthGuard]},
  {path: 'inicio-general', component: InicioGeneralComponent},
  {path: '', redirectTo: 'inicio-general'},// cambiar por el componente de inicio
  {path: '**', redirectTo: 'pages-error404'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }



