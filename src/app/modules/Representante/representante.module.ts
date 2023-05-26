import { NgModule } from "@angular/core";
//import { BrowserModule } from "@angular/platform-browser";
//import { AppRoutingModule } from "src/app/app-routing.module";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
//import { RutModule } from "rut-chileno";
import { CommonModule } from "@angular/common";
import { RepresentanteRoutingModule } from "./representante-routing.module";


@NgModule({
    declarations: [

    ],
    imports: [
      HttpClientModule,
      FormsModule,
      //RutModule,
      ReactiveFormsModule,
      RepresentanteRoutingModule,
      CommonModule
    ],
    providers: [],
  })
  export class RepresentanteModule { }