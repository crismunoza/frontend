import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { RepresentanteRoutingModule } from "./representante-routing.module";
import { AddmiembroComponent } from "./addmiembro/addmiembro.component";
import { EditiniComponent } from "./editini/editini.component";
import { EditmiembroComponent } from "./editmiembro/editmiembro.component";
import { EditproyecComponent } from "./editproyec/editproyec.component";
import { EditsolicitudComponent } from "./editsolicitud/editsolicitud.component";
import { NewproyectComponent } from "./newproyect/newproyect.component";
import { ReportsComponent } from "./reports/reports.component";
import { ViewvalorComponent } from "./viewvalor/viewvalor.component";

@NgModule({
    declarations: [
      AddmiembroComponent,
      EditiniComponent,
      EditmiembroComponent,
      EditproyecComponent,
      EditsolicitudComponent,
      NewproyectComponent,
      ReportsComponent,
      ViewvalorComponent
    ],
    imports: [
      HttpClientModule,
      FormsModule,
      ReactiveFormsModule,
      RepresentanteRoutingModule,
      CommonModule
    ],
    providers: [],
  })
  export class RepresentanteModule { }