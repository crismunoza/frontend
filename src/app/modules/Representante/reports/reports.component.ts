import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { reportes} from 'src/app/interfaces/modelos';
import * as CryptoJS from 'crypto-js';
import { ComunaService } from 'src/app/services/servi.service';
import { PostService } from 'src/app/services/postService.service';

import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  data:any = sessionStorage.getItem('data'); 
 
  listreportes: reportes[] = [];
 fk_id_junta_vecinal!: string;
  imageUrl: string | undefined;

  constructor(
    private auth:AuthService,
    private ComunaService: ComunaService,
    private http: HttpClient
  ) { }
  bytes:any = CryptoJS.AES.decrypt(this.data, this.auth.getKey()) ;
  org:any  = this.bytes.toString(CryptoJS.enc.Utf8);
  obj:any = JSON.parse(this.org);
  ngOnInit(): void {
    this.Mostrarrport();
    console.log("que trae",this.Mostrarrport);
    console.log("que trae",this.obj.id_junta_vec);
  }


  id_Junta:string = this.obj.id_junta_vec;
 //listar vecinos
 
Mostrarrport() {
  const idJuntaVec = parseInt(this.id_Junta); // Parsea a número y asigna 0 si es nulo

  this.ComunaService.verreporte().subscribe(
    (response: any) => {
      console.log("data", response.data);
      if (response.data) {
        this.listreportes = response.data;
        console.log("lista", this.listreportes);
        this.listreportes = this.listreportes.filter((solicitud: reportes) => solicitud.id_junta_vecinal === idJuntaVec);
      }
    },
    error => {
      alert("Error en la petición");
      console.log("Aqui estamos en el error",error);
      console.log(error);
    }
  );
}

generarReporte() {
  const id_junta_vecinal = parseInt(this.id_Junta);
  this.ComunaService.generarReporte(id_junta_vecinal).subscribe(
    (response: any) => {
      // Crear un enlace temporal para descargar el archivo
      const link = document.createElement('a');
      link.href = URL.createObjectURL(response);
      link.download = 'reporte.xlsx';
      link.click();
    },
    (error: any) => {
      console.error('Error al generar el reporte', error);
    }
  );
}




}
