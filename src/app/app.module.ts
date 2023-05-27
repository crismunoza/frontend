import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { RutModule } from 'rut-chileno'; 
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './layouts/header/header.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { SidebarComponent } from './layouts/sidebar/sidebar.component';
import { LoginComponent } from './components/pages/login/login.component';
import { CertificadoComponent } from './components/pages/certificado/certificado.component';
import { ProyectosComponent } from './components/pages/proyectos/proyectos.component';
import { ValoracionComponent } from './components/pages/valoracion/valoracion.component';
import { SolicitudesComponent } from './components/pages/solicitudes/solicitudes.component';
import { NuevasolicitudComponent } from './components/pages/solicitudes/nuevasolicitud/nuevasolicitud.component';
import { PerfilComponent } from './components/pages/perfil/perfil.component';
import { PagesError404Component } from './components/pages/pages-error404/pages-error404.component';
import { InicioComponent } from './components/pages/inicio/inicio.component';
import { HttpClientModule } from '@angular/common/http';
import { InicioGeneralComponent } from './components/inicio-general/inicio-general.component';



@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    LoginComponent,
    CertificadoComponent,
    ProyectosComponent,
    ValoracionComponent,
    SolicitudesComponent,
    NuevasolicitudComponent,
    PerfilComponent,
    PagesError404Component,
    InicioComponent,
    InicioGeneralComponent,
 
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    RutModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
// import { EditiniComponent } from './components/admin/editini/editini.component';
// import { EditproyecComponent } from './components/admin/editproyec/editproyec.component';
// import { EditsolicitudComponent } from './components/admin/editsolicitud/editsolicitud.component';
// import { EditmiembroComponent } from './components/admin/editmiembro/editmiembro.component';
// import { AddmiembroComponent } from './components/admin/addmiembro/addmiembro.component';
// import { ReportsComponent } from './components/admin/reports/reports.component';
// import { ViewvalorComponent } from './components/admin/viewvalor/viewvalor.component';
// import { NewproyectComponent } from './components/admin/newproyect/newproyect.component';

    // EditiniComponent,
    // EditproyecComponent,
    // EditsolicitudComponent,
    // EditmiembroComponent,
    // AddmiembroComponent,
    // ReportsComponent,
    // NewproyectComponent,
    //ViewvalorComponent,   