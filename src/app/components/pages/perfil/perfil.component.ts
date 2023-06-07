import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import * as CryptoJS from 'crypto-js';
import { ComunaService } from 'src/app/services/servi.service';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UpdateService } from 'src/app/services/update.service';
import { ajustePerfil } from 'src/app/interfaces/modelos';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  formData!: FormGroup;

  data:any = sessionStorage.getItem('data');
  rol:any = sessionStorage.getItem('rol');
  //incializamos las variables que vamos a poblar para que sean llamadas en el html
  correo:string = '';
  telefono:any = '';
  nombre_completo:string = '';
  direccion:string = '';
  nombre_junta:string = '';

  constructor(private auth:AuthService, private get:ComunaService, private fb:FormBuilder, private put:UpdateService) {

    this.formData = this.fb.group({
      phonePerfil: [this.telefono, [Validators.required,Validators.pattern('^[0-9]{8}$')]],
      emailPerfil: [this.correo, [Validators.required,Validators.email]]
    });

    this.get.getUserData(parseInt(this.id),this.rol, this.id_junta).subscribe((response) =>{
      if(response.status === 200){
        const datos = response.datos;
        this.correo = datos.correo;
        this.telefono = datos.telefono;
        this.nombre_completo = this.obj.name+' '+datos.s_nombre+' '+this.obj.apellido+' '+datos.s_apellido;
        this.direccion = datos.direccion;
        this.nombre_junta = datos.junta_vecinal;
        //aqui le entregaremos cuando traemos la data, la insertamos en el form
        this.formData.get('phonePerfil')?.setValue(datos.telefono);
        this.formData.get('emailPerfil')?.setValue(datos.correo);
      }
      else{
        Swal.fire({
          icon: 'error',
          title: 'Ups!, hay un problema contactate con nosotros'
        });
      }
    });


   }

  //desencriptaicion de la data en sessionStore
  bytes:any = CryptoJS.AES.decrypt(this.data, this.auth.getKey()) ;
  org:any  = this.bytes.toString(CryptoJS.enc.Utf8);
  obj:any = JSON.parse(this.org);

  avatar:string = this.obj.avatar;
  nombre:string = this.obj.name+' '+this.obj.apellido;
  id:string = this.obj.id;
  id_junta:number = parseInt(this.obj.id_junta_vec);

  ngOnInit(): void {
  }

  enviar(){
    const a = this.formData;
    if(a.invalid){
      console.log('esta incorrecto')
      return
    }
    else{

      const id_us = parseInt(this.id);
      const rolUser = this.rol;
      const datos : ajustePerfil = {
        rol : rolUser,
        telefono : this.formData.controls['phonePerfil'].value,
        correo : this.formData.controls['emailPerfil'].value
      }
       this.put.updatePerfiles(id_us,datos).subscribe(resp =>{
         if(resp.status === 200){
          Swal.fire({
            icon: 'success',
            text: 'Ajustado con exito',
            timer: 1500,
            position: 'center'
          });
         }
       });
    }
  }
}
