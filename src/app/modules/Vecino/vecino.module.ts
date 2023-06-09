import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { VecinoRoutingModule } from "./vecino-routing.module";
import { CertificadoComponent } from "./certificado/certificado.component";
import { ProyectosComponent } from "./proyectos/proyectos.component";
import { SolicitudesComponent } from "./solicitudes/solicitudes.component";
import { NuevasolicitudComponent } from "./solicitudes/nuevasolicitud/nuevasolicitud.component";
import { ValoracionComponent } from "./valoracion/valoracion.component";
import { ContactComponent } from './contact/contact.component';



@NgModule({
    declarations: [
      CertificadoComponent,
      ProyectosComponent,
      SolicitudesComponent,
      NuevasolicitudComponent,
      ValoracionComponent,
      ContactComponent
    ],
    imports: [
      HttpClientModule,
      FormsModule,
      ReactiveFormsModule,
      VecinoRoutingModule,
      CommonModule
    ],
    providers: [],
  })
  export class VecinoModule { }