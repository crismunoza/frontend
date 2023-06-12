import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { SafeUrl } from '@angular/platform-browser';
import { Publication } from 'src/app/interfaces/modelos';
import { PublicacionService } from 'src/app/services/publicacion.service';
import Swal from 'sweetalert2';
import * as CryptoJS from 'crypto-js';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-editini',
  templateUrl: './editini.component.html',
  styleUrls: ['./editini.component.css']
})
export class EditiniComponent implements OnInit {
  publications: Publication[] = [];
  formPublication: FormGroup;
  imagenUrls: { [rutaImagen: string]: SafeUrl } = {};
  titleModal: string = '';
  currentAction: 'submit' | 'update' = 'submit' ;
  idActividad : number = 0;
  data:any = sessionStorage.getItem('data');
  
  constructor(private formBuilder: FormBuilder, private publicacionService: PublicacionService, private auth: AuthService) { 
    this.formPublication = this.formBuilder.group({
      nombrePublicacion: ['', [Validators.required, Validators.minLength(10), this.nameWhitoutNUMBERS]],
      descripcion: ['',[Validators.required, this.descripcionValidator]],
      imagen: [null, Validators.required],
      fecha: [null, [Validators.required, this.fechaValidator]],
      
     
    });
  };

  nameWhitoutNUMBERS(control: AbstractControl): ValidationErrors | null {
    const nombre = control.value;
    const regex = /^[^\d]+$/;
  
    if (nombre && !regex.test(nombre)) {
      return { nameWhitoutNUMBERS: true };
    }
  
    return null;
  };

  descripcionValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const words = value ? value.trim().split(/\s+/) : [];
    if (words.length < 7) {
      return { minWords: true };
    }
    return null;
  };

  fechaValidator(control: AbstractControl): ValidationErrors | null {
    const selectedDate = new Date(control.value);
    const currentDate = new Date();
  
    // Establecer la zona horaria a GMT-4 para Chile
    currentDate.setUTCHours(currentDate.getUTCHours() - 4);
  
    const currentDateOptions = { timeZone: 'UTC' };
    const currentDateFormatted = currentDate.toLocaleDateString('es', currentDateOptions);
    const selectedDateFormatted = selectedDate.toLocaleDateString('es', currentDateOptions);
  
    if (selectedDate && selectedDateFormatted !== currentDateFormatted) {
      return { fechaInvalida: true };
    }
  
    return null;
  }
  bytes:any = CryptoJS.AES.decrypt(this.data, this.auth.getKey());
  org:any = this.bytes.toString(CryptoJS.enc.Utf8);
  obj:any = JSON.parse(this.org);

  id_junta_vecinal:string = this.obj.id_junta_vec;
  

  submitPublication() {
    if (this.formPublication.valid) {
      // Obtención rut usuario.
      const accessToken = localStorage.getItem('access_token');
      let rut = '';
      if (accessToken) {
        const payload = accessToken.split('.')[1];
        const decodedPayload = atob(payload);
        const userData = JSON.parse(decodedPayload);
        rut = userData.rut_user;
      } else {
        console.log('No se encontró el token');
      }
  
      //obtención de la imagen como cadena Base64.
      const inputElement = document.getElementById('imageInput') as HTMLInputElement;
      const file = inputElement.files && inputElement.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          const publicationData = {
            nombre: this.formPublication.value.nombrePublicacion,
            descripcion: this.formPublication.value.descripcion,
            imagen: base64String,
            fecha_actividad: this.formPublication.value.fecha,
            rut_user: rut
          };
            this.publicacionService.insertPublicacion(publicationData)
            .then(message => {
              console.log(message);
              Swal.fire({
                icon: 'success',
                title: 'Agregado',
                text: message.resp
              })
              .then(() => {
                window.location.reload();
              })
            })
            .catch(error => {
              let messageAlert;
              messageAlert = error.errorType === 0 ? error.messageError : error.messageError;
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: messageAlert,
              });
              console.error(error);
            });
        };
        reader.readAsDataURL(file); 
      }
    }
  };

  updatePublication() {
    
    if (this.formPublication.valid) {
      // Obtención rut usuario.
      const accessToken = localStorage.getItem('access_token');
      let rut = '';
      if (accessToken) {
        const payload = accessToken.split('.')[1];
        const decodedPayload = atob(payload);
        const userData = JSON.parse(decodedPayload);
        rut = userData.rut_user;
      } else {
        console.log('No se encontró el token');
      }
  
      //obtención de la imagen como cadena Base64.
      const inputElement = document.getElementById('imageInput') as HTMLInputElement;
      const file = inputElement.files && inputElement.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          const publicationData = {
            id_actividad: this.idActividad,
            nombre: this.formPublication.value.nombrePublicacion,
            descripcion: this.formPublication.value.descripcion,
            imagen: base64String,
            fecha_actividad: this.formPublication.value.fecha,
            rut_user: rut
          };
            this.publicacionService.updatePublication(this.idActividad, publicationData)
            .then(message => {
              console.log(message);
              Swal.fire({
                icon: 'success',
                title: 'Modificado',
                text: message.resp
              })
              .then(() => {
                window.location.reload();
              })
            })
            .catch(error => {
              let messageAlert;
              messageAlert = error.errorType === 0 ? error.messageError : error.messageError;
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: messageAlert,
              });
              console.error(error);
            });
          
        };
        reader.readAsDataURL(file); 
      }
    }
  };
  
  updatetitle(flag: number, idActividad : number = 0) {
    this.titleModal = flag === 0 ? this.titleModal = 'Crear publicación': this.titleModal = 'Modificar publicación';
    this.currentAction = flag === 0 ? this.currentAction = 'submit': this.currentAction = 'update';
    this.idActividad = idActividad 
  };

  submitAction() {
    if (this.currentAction === 'submit') {
      this.submitPublication();
    } else if (this.currentAction === 'update') {
      this.updatePublication();
    }
  };
  ngOnInit(): void {
    setTimeout(() => {
      this.publicacionService.getAllPublications(parseInt(this.id_junta_vecinal))
        .subscribe(data => {
          this.publications = data;
          
  
          for (const publication of this.publications) {
            this.publicacionService
              .getImagen(publication.ruta_imagen)
              .subscribe(url => {
                this.imagenUrls[publication.ruta_imagen] = url;
              });
          };
        });
    }, 700);
  }

}
