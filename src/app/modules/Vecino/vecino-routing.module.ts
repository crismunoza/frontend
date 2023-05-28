import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CertificadoComponent } from "./certificado/certificado.component";
import { ProyectosComponent } from "./proyectos/proyectos.component";
import { SolicitudesComponent } from "./solicitudes/solicitudes.component";
import { NuevasolicitudComponent } from "./solicitudes/nuevasolicitud/nuevasolicitud.component";
import { ValoracionComponent } from "./valoracion/valoracion.component";



const routes: Routes = [
    {
        path:'accion',
        children:[
            {path: 'certificado', component: CertificadoComponent},
            {path: 'proyectos', component: ProyectosComponent},
            {path: 'solicitudes', component: SolicitudesComponent},
            {path: 'nuevasolicitud', component: NuevasolicitudComponent},
            {path: 'valoracion', component: ValoracionComponent},
            
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class VecinoRoutingModule { }