import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";


const routes: Routes = [
    {
        path:'representante',
        children:[
            //{ path: 'junta-vecinal', component: RegisterRepComponent },
            //{ path:'reg-vecino',component:RegisterComponent}
            
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class RepresentanteRoutingModule { }