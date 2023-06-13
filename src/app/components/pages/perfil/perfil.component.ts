import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import * as CryptoJS from 'crypto-js';
import { ComunaService } from 'src/app/services/servi.service';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UpdateService } from 'src/app/services/update.service';
import { ajustePerfil } from 'src/app/interfaces/modelos';
import { Router } from '@angular/router';
import { PostService } from 'src/app/services/postService.service';
@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  formData!: FormGroup;
  cambioClave!:FormGroup;
  submitted:boolean = false;

  data:any = sessionStorage.getItem('data');
  rol:any = sessionStorage.getItem('rol');
  //incializamos las variables que vamos a poblar para que sean llamadas en el html
  correo:string = '';
  telefono:any = '';
  nombre_completo:string = '';
  direccion:string = '';
  nombre_junta:string = '';

  constructor(private auth:AuthService, private get:ComunaService, private fb:FormBuilder, private put:UpdateService, private router:Router,
    private postservice: PostService) {

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

   //funcion para comparar las claves
   checarSiSonIguales(): boolean {
    return this.cambioClave.hasError('noSonIguales') &&
      this.cambioClave.get('nvaPassword')!.dirty &&
      this.cambioClave.get('reNvaPassword')!.dirty;
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
    this.cambioClave = this.fb.group({
      claveActual: ["",[Validators.required]],
      nvaPassword: ["",[Validators.required]]
    });
  }


  //funcion del boton enviar Cambios
  enviar(){
    const a = this.formData;
    if(a.invalid){
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
            showConfirmButton: false,
            timer: 1500,
            position: 'center'
          }).then(() => {
            this.formData.reset();
            window.location.reload()
          });
         }
       });
    }
  }

  eliminarCuenta(){
    Swal.fire({
      title: '¿Estas seguro?',
      text: "No podras revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Si, eliminar!'
    }).then((result) => {
      if (result.isConfirmed) {
        const id = parseInt(this.id);
        const id_junta = parseInt(this.obj.id_junta_vec);
        this.postservice.deleteUser(id, id_junta).subscribe(res =>{
          if(res.status === 200){
            Swal.fire({
              icon: 'success',
              title: 'Tu cuenta ha sido eliminada',
              showConfirmButton: false,
              timer: 1500,
              position: 'center'
            }).then(() => {
              sessionStorage.clear();
              this.router.navigate(['/']);
            });
          }
          else if(res.status === 404){
            Swal.fire({
              icon: 'error',
              title: 'No se puede eliminar por que eres el unico administrador'
            });
          }
          else if(res.error){
            Swal.fire({
              icon: 'error',
              title: 'Ups!, hay un problema contactate con nosotros'
            });
          }
        });
      }
    })
  }

  //funcion del boton cambiar clave
  cambiarClave(){
    this.submitted = true;
    const c = this.cambioClave;
    if(c.invalid){
      return
    }
    else{
      const id = parseInt(this.id);
      const actual = this.cambioClave.controls['claveActual'].value;
      const Nva = this.cambioClave.controls['nvaPassword'].value;
      const datos = {rol : this.rol, contraActual : actual, contraNva:Nva}
      this.put.UpdateClave(id,datos).subscribe(res =>{
        if(res.status === 200){
          Swal.fire({
            icon:'success',
            title: res.respuesta
          });
          this.cambioClave.reset();
        }
        else{
          Swal.fire({
            icon:'error',
            title: res.respuesta
          });
        }
      });
    }
  }
}
