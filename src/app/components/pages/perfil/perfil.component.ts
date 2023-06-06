import { Component, OnInit, ElementRef } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import * as CryptoJS from 'crypto-js';
import { ComunaService } from 'src/app/services/servi.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  data:any = sessionStorage.getItem('data');
  rol:any = sessionStorage.getItem('rol');
  //incializamos las variables que vamos a poblar para que sean llamadas en el html
  correo:string = '';
  telefono:any = '';
  nombre_completo:string = '';
  direccion:string = '';
  nombre_junta:string = '';
  constructor(private auth:AuthService, private get:ComunaService) { }
  bytes:any = CryptoJS.AES.decrypt(this.data, this.auth.getKey()) ;
  org:any  = this.bytes.toString(CryptoJS.enc.Utf8);
  obj:any = JSON.parse(this.org);

  avatar:string = this.obj.avatar;
  nombre:string = this.obj.name+' '+this.obj.apellido;
  id:string = this.obj.id;
  id_junta:number = parseInt(this.obj.id_junta_vec);
  ngOnInit(): void {
    this.get.getUserData(parseInt(this.id),this.rol, this.id_junta).subscribe((response) =>{
      if(response.status === 200){
        const datos = response.datos;
        this.correo = datos.correo;
        this.telefono = datos.telefono;
        this.nombre_completo = this.obj.name+' '+datos.s_nombre+' '+this.obj.apellido+' '+datos.s_apellido;
        this.direccion = datos.direccion;
        this.nombre_junta = datos.junta_vecinal;
      }
      else{
        Swal.fire({
          icon: 'error',
          title: 'Ups!, hay un problema contactate con nosotros'
        });
      }
    });
  }

}
