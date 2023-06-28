import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Vecino, Vecino2, RepresentanteVecinal1, RepresentanteVecinal2 } from 'src/app/interfaces/modelos';
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
  data: any = sessionStorage.getItem('data');
  formularioVecino: FormGroup;
  formularioReprese: FormGroup;
  listVecinos: Vecino[] = [];
  listRepresentantes: RepresentanteVecinal1 [] = [];
  rutSeleccionado: string = '';
  fk_id_junta_vecinal!: string;
  id_junta_vecinal!: string;
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

  repreSeleccionado: RepresentanteVecinal2 = {
    rut_representante: '',
    primer_nombre: '',
    segundo_nombre: '',
    primer_apellido: '',
    segundo_apellido: '',
    direccion: '',
    numero: 0,
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
      correo_electronico: ['', [Validators.required, Validators.email, Validators.pattern(/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/)]],
      telefono: ['', Validators.required],
      contrasenia: ['', Validators.required]
    });

    this.formularioReprese = this.formBuilder.group({
      rut_vecino: ['', Validators.required],
      primer_nombre: ['', Validators.required],
      segundo_nombre: [''],
      primer_apellido: ['', Validators.required],
      segundo_apellido: [''],
      direccion: ['', Validators.required],
      numero: ['', Validators.required],
      correo_electronico: ['', [Validators.required, Validators.email, Validators.pattern(/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/)]],
      telefono: ['', Validators.required],
      contrasenia: ['', Validators.required]
    });
  }

  bytes: any = CryptoJS.AES.decrypt(this.data, this.auth.getKey());
  org: any = this.bytes.toString(CryptoJS.enc.Utf8);
  obj: any = JSON.parse(this.org);

  id_Junta: string = this.obj.id_junta_vec;

  ngOnInit(): void {
    this.listarMiembros();
    this.listarRepresentantes();
  }

  listarMiembros() {
    const idJuntaVec = parseInt(this.id_Junta); // Parsea a número y asigna 0 si es nulo

    this.ComunaService.getvecinos().subscribe(
      data => {
        this.listVecinos = data.listVecinos.filter(({ fk_id_junta_vecinal }) => fk_id_junta_vecinal === idJuntaVec);
      },
      error => {
        console.log(error);
      }
    );    
  }

  listarRepresentantes() {
        const idJuntaVec = parseInt(this.id_Junta); 
        this.ComunaService.getrepresentantes(idJuntaVec).subscribe(
      data => {
        this.listRepresentantes = data.listRepresentantes
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

  editarrepre(repre: RepresentanteVecinal2) {
    this.repreSeleccionado = repre;
    this.formularioReprese.patchValue(repre);
  }


  seleccionarVecino(rut: string) {
    this.rutSeleccionado = rut;
    console.log('este es el rut que seleccionamos',this.rutSeleccionado)
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
          setTimeout(() => {
            window.location.reload();
          }, 2000);
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

  eliminarrepresentate(rut_representante: string) {
    const idJuntaVec = parseInt(this.id_Junta); 
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
        this.deleteVecino.deletereprese(rut_representante, idJuntaVec).subscribe(res => {
          this.listarRepresentantes();
          if (res.status === 200) {
            Swal.fire({
              icon: 'success',
              title: 'Tu cuenta ha sido eliminada',
              showConfirmButton: false,
              timer: 1500,
              position: 'center'
            });
          }
          else if (res.status === 404) {
            Swal.fire({
              icon: 'error',
              title: 'No se puede eliminar por que eres el unico administrador'
            });
          }
          else if (res.error) {
            Swal.fire({
              icon: 'error',
              title: 'Ups!, hay un problema contactate con nosotros'
            });
          }
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


updaterepre() {
  const updatedrepre: RepresentanteVecinal2 = {
    ...this.repreSeleccionado
  };
  // Actualizar los campos modificados del formulario
  updatedrepre.rut_representante = this.rutSeleccionado;
  updatedrepre.primer_nombre = this.formularioReprese.get('primer_nombre')?.value;
  updatedrepre.segundo_nombre = this.formularioReprese.get('segundo_nombre')?.value;
  updatedrepre.primer_apellido = this.formularioReprese.get('primer_apellido')?.value;
  updatedrepre.segundo_apellido = this.formularioReprese.get('segundo_apellido')?.value;
  updatedrepre.direccion = this.formularioReprese.get('direccion')?.value;
  updatedrepre.numero = this.formularioReprese.get('numero')?.value; // Corregido: propiedad "numero"
  updatedrepre.telefono = this.formularioReprese.get('telefono')?.value;
  updatedrepre.correo_electronico = this.formularioReprese.get('correo_electronico')?.value;
  updatedrepre.contrasenia = this.formularioReprese.get('contrasenia')?.value;


    // Combinar con la lógica existente para actualizar los campos no modificados
    for (const repre of this.listRepresentantes) {
      if (repre.primer_nombre && !updatedrepre.primer_nombre) {
        updatedrepre.primer_nombre = repre.primer_nombre;
      }
      if (repre.segundo_nombre && !updatedrepre.segundo_nombre) {
        updatedrepre.segundo_nombre = repre.segundo_nombre;
      }
      if (repre.primer_apellido && !updatedrepre.primer_apellido) {
        updatedrepre.primer_apellido = repre.primer_apellido;
      }
      if (repre.segundo_apellido && !updatedrepre.segundo_apellido) {
        updatedrepre.segundo_apellido = repre.segundo_apellido;
      }
      if (repre.direccion && !updatedrepre.direccion) {
        updatedrepre.direccion = repre.direccion;
      }
      if (repre.numero && !updatedrepre.numero) {
        updatedrepre.numero = repre.numero;
      }
      if (repre.telefono && !updatedrepre.telefono) {
        updatedrepre.telefono = repre.telefono;
      }
      if (repre.correo_electronico && !updatedrepre.correo_electronico) {
        updatedrepre.correo_electronico = repre.correo_electronico;
      }
      if (repre.contrasenia && !updatedrepre.contrasenia) {
        updatedrepre.contrasenia = repre.contrasenia;
      }
    }

    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Se actualizarán los datos del Representante Vecinal',
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
          'Representante Vecinal actualizado',
          'success'
        );
        this.updateVecino.updatereprese(updatedrepre.rut_representante, updatedrepre).subscribe(
          data => {
            this.formularioVecino.reset();
            setTimeout(() => {
              window.location.reload();
            }, 2000);

            // Resto del código...
          },
          error => {
            console.log('Error al actualizar el Representante Vecinal', error);
          }
        );
      } else {
        Swal.fire(
          'Cancelado',
          'Representante Vecinal no actualizado',
          'error'
        );
        this.formularioVecino.reset();
      }
    });
  }
}