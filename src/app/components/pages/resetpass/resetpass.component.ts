import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RutService } from 'rut-chileno';
import { Router } from '@angular/router';
import { ComunaService } from '../../../services/servi.service';
import { PostService } from '../../../services/postService.service';

import Swal from 'sweetalert2';


@Component({
  selector: 'app-resetpass',
  templateUrl: './resetpass.component.html',
  styleUrls: ['./resetpass.component.css']
})
export class ResetpassComponent implements OnInit {
  parentForm!: FormGroup;
  resetpass!: FormGroup;
  submit = false;
  showRutInput: boolean = true;
  showCorreoInput: boolean = false;
  showRestablecerContrasenia: boolean = false;

  constructor(private router: Router, private fb: FormBuilder, 
    private rutService: RutService, private comunaService: ComunaService,
    private PostService: PostService) { }

  formatearRut(event: Event): void {
    let rut = this.rutService.getRutChileForm(1, (event.target as HTMLInputElement).value);
    if (rut) {
      this.resetpass.controls['rut'].patchValue(rut, { emitEvent: false });
    }
  }

  
  // verificarRut() {
  //   this.submit = true;
  //   if (this.resetpass.controls['rut'].invalid) {
  //     return;
  //   }
    
  //   let rut = this.resetpass.controls['rut'].value;
  //   // Aquí debes enviar el rut al backend y manejar la respuesta
  //   this.comunaService.verificarRut(rut).subscribe(res => {
  //     if (res.msg === 'ok') {
  //       Swal.fire({
  //         position: 'center',
  //         icon: 'success',
  //         title: 'Rut Verificado',
  //         showConfirmButton: false,
  //         timer: 2000
  //       }).then(() => {
  //         this.showRutInput = false;
  //         this.showCorreoInput = true;
  //       });
  //     } else if(res.msg === 'no esta') {
  //       // Aquí puedes manejar el mensaje recibido en el bloque else if
  //       Swal.fire({
  //         position: 'center',
  //         icon: 'error',
  //         title: 'Rut no  Registrado',
  //         showConfirmButton: false,
  //         timer: 2000
  //       });
        
  //     }
  //   }, error => {
  //     Swal.fire({
  //       position: 'center',
  //       icon: 'error',
  //       title: 'no se pudo verificar el rut',
  //       showConfirmButton: false,
  //       timer: 2000
  //     });
  //     console.log('Error al obtener las juntas vecinales:', error);
  //   });
  // }
  
  

  // verificarCorreo() {
  //   this.submit = true;
  //   if (this.resetpass.controls['correo_electronico'].invalid) {
  //     return;
  //   }
    
  //   let correo_electronico = this.resetpass.controls['correo_electronico'].value;
  //   // Aquí debes enviar el correo al backend y manejar la respuesta
  //   this.comunaService.verificarCorreo(correo_electronico).subscribe(res => {
  //     if (res.msg === 'ok correo') {
  //       Swal.fire({
  //         position: 'center',
  //         icon: 'success',
  //         title: 'Correo Verificado',
  //         showConfirmButton: false,
  //         timer: 2000
  //       }).then(() => {
  //         this.showCorreoInput = false;
  //         this.showRestablecerContrasenia = true;
  //       });
  //     } else if (res.msg === 'no esta el correo') {
  //       // Aquí puedes manejar el mensaje recibido en el bloque else if
  //       Swal.fire({
  //         position: 'center',
  //         icon: 'error',
  //         title: 'Correo no encontrado',
  //         showConfirmButton: false,
  //         timer: 2000
  //       });
  //     }
  //   }, error => {
  //     Swal.fire({
  //       position: 'center',
  //       icon: 'error',
  //       title: 'No se pudo verificar el correo',
  //       showConfirmButton: false,
  //       timer: 2000
  //     });
  //     console.log('Error al obtener las juntas vecinales:', error);
  //   });
  // }
  

  restablecerContrasenia() {
    this.submit = true;
    if (this.resetpass.controls['rut'].invalid || this.resetpass.controls['correo_electronico'].invalid) {
      return;
    }
    const correo_electronico = this.resetpass.controls['correo_electronico'].value;
    const rut = this.resetpass.controls['rut'].value;

    // Aquí debes enviar el rut y la contraseña al backend para que haga el update
    // y manejar la respuesta
    this.PostService.cambiarContrasena(rut, correo_electronico).subscribe(res => {
      if (res.msg === 'ok') {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'se ha enviado un correo con la nueva contraseña',
          showConfirmButton: false,
          timer: 3000
        }).then(() => {
          this.router.navigate(['/login']);
        });
      } else if (res.msg === 'okrut') {
        if (res.error === 'correo_incorrecto') {
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Correo electronico incorrecto',
            showConfirmButton: false,
            timer: 2000
          });
        } else if (res.error === 'rut_inexistente') {
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'El Rut no esta registrado',
            showConfirmButton: false,
            timer: 2000
          });
        } else {
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Error desconocido',
            showConfirmButton: false,
            timer: 2000
          });
        }
      }
    }, error => {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Error al actualizar la contraseña',
        showConfirmButton: false,
        timer: 2000
      });
      console.log(error);
    });
  }
  

  ngOnInit(): void {
    this.resetpass = this.fb.group({
      rut: ["", [Validators.required]],
      correo_electronico: ["", [Validators.required, Validators.email,Validators.pattern(/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/)]],
      contrasenia: ["", [Validators.required]],
      repetircontrasenia: ["", [Validators.required]]
    });
  }
}
