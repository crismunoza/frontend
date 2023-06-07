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
