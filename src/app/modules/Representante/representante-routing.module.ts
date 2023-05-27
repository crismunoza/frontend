import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AddmiembroComponent } from "./addmiembro/addmiembro.component";
import { EditiniComponent } from "./editini/editini.component";
import { EditmiembroComponent } from "./editmiembro/editmiembro.component";
import { EditproyecComponent } from "./editproyec/editproyec.component";
import { EditsolicitudComponent } from "./editsolicitud/editsolicitud.component";
import { NewproyectComponent } from "./newproyect/newproyect.component";
import { ReportsComponent } from "./reports/reports.component";
import { ViewvalorComponent } from "./viewvalor/viewvalor.component";


const routes: Routes = [
    {
        path:'representante',
        children:[
            { path: 'add-miembro', component: AddmiembroComponent },
            { path:'edit-ini',component:EditiniComponent},
            { path:'edit-miemb',component:EditmiembroComponent},
            { path:'edit-proyec',component: EditproyecComponent},
            { path:'edit-sol',component:EditsolicitudComponent},
            { path:'nvo-proy', component:NewproyectComponent},
            { path:'reports',component:ReportsComponent},
            { path:'viewValoracion', component:ViewvalorComponent}
            
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class RepresentanteRoutingModule { }