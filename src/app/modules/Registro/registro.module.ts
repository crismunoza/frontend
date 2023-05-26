import { NgModule } from "@angular/core";
import { RegisterRepComponent } from "./register-rep/register-rep.component";
import { BrowserModule } from "@angular/platform-browser";
import { AppRoutingModule } from "src/app/app-routing.module";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RutModule } from "rut-chileno";
import { RegistroRoutingModule } from "./registro-routing.module";
import { CommonModule } from "@angular/common";
import { RegisterComponent } from "./register/register.component";


@NgModule({
    declarations: [
        RegisterRepComponent,
        RegisterComponent
    ],
    imports: [
      HttpClientModule,
      FormsModule,
      RutModule,
      ReactiveFormsModule,
      RegistroRoutingModule,
      CommonModule
    ],
    providers: [],
  })
  export class RegistroModule { }