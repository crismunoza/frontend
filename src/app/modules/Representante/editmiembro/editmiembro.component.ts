import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Vecino, Vecino2 } from 'src/app/interfaces/modelos';
import * as CryptoJS from 'crypto-js';
import { ComunaService } from 'src/app/services/servi.service';
import { PostService } from 'src/app/services/postService.service';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editmiembro',
  templateUrl: './editmiembro.component.html',
  styleUrls: ['./editmiembro.component.css']
})
export class EditmiembroComponent implements OnInit {
  @ViewChild('verticalycentered') modal: ElementRef | undefined;
  data:any = sessionStorage.getItem('data');
  formularioVecino: FormGroup;
  listVecinos: Vecino[] = [];
  rutSeleccionado: string = '';
  fk_id_junta_vecinal!: string;
  vecinoSeleccionado: Vecino2 = {
    rut_vecino: '',
    primer_nombre: '',
    segundo_nombre: '',
    primer_apellido: '',
    segundo_apellido: '',
    direccion: '',
    correo_electronico: '',
    telefono: 0,
    contrasenia: ''
  };

  constructor(
    private auth: AuthService,
    private ComunaService: ComunaService,
    private deleteVecino: PostService,
    private updateVecino: PostService,
    private formBuilder: FormBuilder
  ) {
    this.formularioVecino = this.formBuilder.group({
      rut_vecino: ['', Validators.required],
      primer_nombre: ['', Validators.required],
      segundo_nombre: [''],
      primer_apellido: ['', Validators.required],
      segundo_apellido: [''],
      direccion: ['', Validators.required],
      correo_electronico: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.required],
      contrasenia: ['', Validators.required]
    });
  }

  bytes:any = CryptoJS.AES.decrypt(this.data, this.auth.getKey());
  org:any = this.bytes.toString(CryptoJS.enc.Utf8);
  obj:any = JSON.parse(this.org);

  id_Junta:string = this.obj.id_junta_vec;

  ngOnInit(): void {
    this.listarMiembros();
    console.log(this.listVecinos);
  }

  listarMiembros() {
    const idJuntaVec = parseInt(this.id_Junta); // Parsea a número y asigna 0 si es nulo

    this.ComunaService.getvecinos().subscribe(
      data => {
        console.log("data", data);
        this.listVecinos = data.listVecinos.filter(({ fk_id_junta_vecinal }) => fk_id_junta_vecinal === idJuntaVec);
      },
      error => {
        console.log(error);
      }
    );
  }

  editarVecino(vecino: Vecino2) {
    this.vecinoSeleccionado = vecino;
    this.formularioVecino.patchValue(vecino);
  }

  seleccionarVecino(rut: string) {
    this.rutSeleccionado = rut;
    console.log("vecino seleccionado en el modal", this.rutSeleccionado);
  }

  salir() {
    this.formularioVecino.reset();
  }

  eliminarVecino(rut_vecino: string) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esta acción",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
          if (result.isConfirmed) {
            this.deleteVecino.deleteVecino(rut_vecino).subscribe(data => {
            this.listarMiembros();
              }, error => {
              console.log(error);
              });
          }
          else if (result.isDismissed) {
            Swal.fire(
              'Cancelado',
              '...............',
              'error'
            )
            console.log('Clicked No, File is safe!');
          }
        });
  }

  updateVecinos() {
    const updatedVecino: Vecino2 = { ...this.vecinoSeleccionado };
  // Actualizar los campos modificados del formulario
  updatedVecino.rut_vecino = this.rutSeleccionado;
  updatedVecino.primer_nombre = this.formularioVecino.get('primer_nombre')?.value;
  updatedVecino.segundo_nombre = this.formularioVecino.get('segundo_nombre')?.value;
  updatedVecino.primer_apellido = this.formularioVecino.get('primer_apellido')?.value;
  updatedVecino.segundo_apellido = this.formularioVecino.get('segundo_apellido')?.value;
  updatedVecino.direccion = this.formularioVecino.get('direccion')?.value;
  updatedVecino.telefono = this.formularioVecino.get('telefono')?.value;
  updatedVecino.correo_electronico = this.formularioVecino.get('correo_electronico')?.value;
  updatedVecino.contrasenia = this.formularioVecino.get('contrasenia')?.value;

  // Combinar con la lógica existente para actualizar los campos no modificados
  for (const vecino of this.listVecinos) {
    if (vecino.primer_nombre && !updatedVecino.primer_nombre) {
      updatedVecino.primer_nombre = vecino.primer_nombre;
    }
    if (vecino.segundo_nombre && !updatedVecino.segundo_nombre) {
      updatedVecino.segundo_nombre = vecino.segundo_nombre;
    }
    if (vecino.primer_apellido && !updatedVecino.primer_apellido) {
      updatedVecino.primer_apellido = vecino.primer_apellido;
    }
    if (vecino.segundo_apellido && !updatedVecino.segundo_apellido) {
      updatedVecino.segundo_apellido = vecino.segundo_apellido;
    }
    if (vecino.direccion && !updatedVecino.direccion) {
      updatedVecino.direccion = vecino.direccion;
    }
    if (vecino.telefono && !updatedVecino.telefono) {
      updatedVecino.telefono = vecino.telefono;
    }
    if (vecino.correo_electronico && !updatedVecino.correo_electronico) {
      updatedVecino.correo_electronico = vecino.correo_electronico;
    }
    if (vecino.contrasenia && !updatedVecino.contrasenia) {
      updatedVecino.contrasenia = vecino.contrasenia;
    }
  }
     
    console.log("vecino actualizado", updatedVecino);
  
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Se actualizarán los datos del vecino',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          'Aceptado',
          'Vecino actualizado',
          'success'
        );
        this.updateVecino.updatevecino(updatedVecino.rut_vecino, updatedVecino).subscribe(
          data => {
            console.log(data); // Maneja la respuesta del backend según tus necesidades
            this.formularioVecino.reset();
            setTimeout(() => {
              window.location.reload();
            }, 2000);
            
            // Resto del código...
          },
          error => {
            console.log('Error al actualizar el vecino', error);
          }
        );
      } else {
        Swal.fire(
          'Cancelado',
          'Vecino no actualizado',
          'error'
        );
        this.formularioVecino.reset();
      }
    });
  }
}