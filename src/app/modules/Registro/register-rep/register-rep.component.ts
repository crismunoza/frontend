
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RutService } from 'rut-chileno';
import { RepresentanteVecinal, comuna } from 'src/app/interfaces/modelos';
import { PostService } from 'src/app/services/postService.service';
import { ComunaService } from 'src/app/services/servi.service';
import {JuntaVecinal} from 'src/app/interfaces/modelos';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register-rep',
  templateUrl: './register-rep.component.html',
  styleUrls: ['./register-rep.component.scss']
})
export class RegisterRepComponent implements OnInit {
  parentForm!: FormGroup;
  //iniciacion del submit siempre falso 
  submitted = false;

  selectedAvatar!: string;
  comunaRazon!: string;
  //aqui entregamos los nombre de los archivos de los avatars 
  avatars: string[] = ['bear.png', 'cat.png', 'lion.png','meerkat.png','panda.png','polar-bear.png','sloth.png']; 
  // inicializar variables
  listcomunas: comuna[] = [];

  constructor(private fb: FormBuilder,private rutService: RutService,private comunaService: ComunaService, private junta:PostService,private router:Router) { 
    
  }

   //aqui se formatea el rut cuando se inserta
   formatearRut(event : Event): void {
    let rut = this.rutService.getRutChileForm(1, (event.target as HTMLInputElement).value)
    if (rut)
      this.parentForm.controls['rut_junta'].patchValue(rut, {emitEvent :false});    
    } 
    formatearRut2(event : Event): void {
      let rut = this.rutService.getRutChileForm(1, (event.target as HTMLInputElement).value)
      if (rut)
        this.parentForm.controls['run_rep'].patchValue(rut, {emitEvent :false});    
      } 

  ngOnInit(): void {

    // aqui iniciamos el form "formparent" e indicamos los validadores
    this.parentForm = this.fb.group({
      rut_junta: ["", [Validators.required, this.rutService.validaRutForm]], // <- Aqui es donde viene el validador la funcion validaRutForm la cual retorna un null o un objeto { [key: string]: boolean } 
      nomb_junta: ["", [Validators.required]],
      comuna_junta:[""],
      calle_junta: ["", [Validators.required, Validators.pattern("^[a-zA-Z ]+$")]],
      num_calle_junta: ["", [Validators.required, Validators.pattern("^[0-9]\\d*$")]],
      run_rep: ["", [Validators.required, this.rutService.validaRutForm]],
      p_nomb_rep: ["", [Validators.required, Validators.pattern("^[a-zA-Z]+$")]],
      s_nomb_rep: ["", [Validators.required, Validators.pattern("^[a-zA-Z]+$")]],
      ap_pat_rep: ["", [Validators.required, Validators.pattern("^[a-zA-Z]+$")]],
      ap_mat_rep: ["", [Validators.required, Validators.pattern("^[a-zA-Z]+$")]],
      comuna_rep:[""],
      calle_rep: ["", [Validators.required, Validators.pattern("^[a-zA-Z ]+$")]],
      num_calle_rep: ["", [Validators.required, Validators.pattern("^[0-9]\\d*$")]],
      contacto_Rep: ["", [Validators.required, Validators.pattern("^[0-9]{8}$")]],
      correo_rep: ["", [Validators.required,Validators.email]],
      clave_rep: ["", [Validators.required]],
      clave_rep_conf: ["", [Validators.required]],
      selectedAvatar: new FormControl(null),
      evidencia:["", [Validators.required]]
    });

    //consumir el servicio listar comunas
    this.comunaService.getComunas().subscribe(
      (data: { listComunas: comuna[] }) => {
        this.listcomunas = data.listComunas;
      },
      error => {
        console.log(error); // Mostrar el error en la consola
      }
    );
  }

  onChangeAvatar() {
    this.selectedAvatar = this.parentForm.controls['selectedAvatar'].value;
    console.log(this.selectedAvatar);
  }

  open_Modal(){
    console.log('Abrir modal');
  }

  onSubmit(){
    this.submitted = true;
    // stop here if form is invalid
    if (this.parentForm.invalid) {
        return;
    }
    else {
      //capturamos los valores de los formularios y se los entregamos a la variable de la interfaces
      const junta: JuntaVecinal = {
        id_comuna: this.parentForm.controls['comuna_junta'].value,
        razon_social: this.parentForm.controls['nomb_junta'].value,
        direccion: this.parentForm.controls['calle_junta'].value,
        numero_calle: this.parentForm.controls['num_calle_junta'].value,
        rut_junta: this.parentForm.controls['rut_junta'].value,
      }    
      console.log(junta);

      this.junta.insertJuntaVecinal(junta)
      .subscribe(response => {
        // Maneja la respuesta de la solicitud aquí
        try {
          // Si el mensaje tiene un 'ok', realizaremos una inserción del representante
          if (response.msg === 'ok') {
            
            const fileInput = document.getElementById('evidencia') as HTMLInputElement;
            const file = fileInput.files?.[0];  

            if (file) {
              //FileReader permite almacenar ficheros de datos de forma asyncrona desde el navegador (img, videos, etc.)
              const reader = new FileReader();            
              //cuando esta en cargado ya en el navegador
              reader.onload = () => {
                //convertimos la imagen o el reader a un string 
                const base64Image = reader.result as string;

                const RepOne: RepresentanteVecinal = {
                  rut_representante: this.parentForm.controls['run_rep'].value,
                  primer_nombre: this.parentForm.controls['p_nomb_rep'].value,
                  segundo_nombre: this.parentForm.controls['s_nomb_rep'].value,
                  primer_apellido: this.parentForm.controls['ap_pat_rep'].value,
                  segundo_apellido: this.parentForm.controls['ap_mat_rep'].value,
                  direccion_rep: this.parentForm.controls['calle_rep'].value,
                  numero_rep: this.parentForm.controls['num_calle_rep'].value,
                  correo_electronico: this.parentForm.controls['correo_rep'].value,
                  telefono: this.parentForm.controls['contacto_Rep'].value,
                  contrasenia: this.parentForm.controls['clave_rep'].value,
                  comuna_rep: this.parentForm.controls['comuna_junta'].value,
                  avatar: this.parentForm.controls['selectedAvatar'].value,
                  ruta_evidencia: 'hola.txt',
                  ruta_firma: base64Image,
                  id_junta_vecinal: response.id
                };

                this.junta.inserRep(RepOne).subscribe(response => {
                  if (response.msg === 'yes') {
                    Swal.fire({
                      position: 'center',
                      icon: 'success',
                      title: 'Generada con exito, Ahora puedes ingresar',
                      showConfirmButton: false,
                      timer: 2000
                    }).then(() => {
                      this.router.navigate(['login']);
                    });

                  }
                  else{
                    this.parentForm.reset();
                    Swal.fire({
                      icon: 'error',
                      title: response.msg
                    });
                  }
                });
              };

              //esta da por finalizada la carga del archivo al navgador y la lista como DONE la tarea
              reader.readAsDataURL(file);
            }          
            
          }
          else{
            Swal.fire({
              icon: 'error',
               title: 'La junta vecinal ya se encuentra registrada.'
             });
          }
        } catch  (error){
           Swal.fire({
           icon: 'error',
            title: 'La junta vecinal ya se encuentra registrada.'
          });
        }
 
         });
       

    }
  }

}