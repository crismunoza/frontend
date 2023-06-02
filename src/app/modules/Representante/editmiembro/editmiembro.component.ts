import { Component, OnInit } from '@angular/core';
import { Vecino, Vecino2 } from 'src/app/interfaces/modelos';
import * as CryptoJS from 'crypto-js';
import { ComunaService } from 'src/app/services/servi.service';
import { PostService } from 'src/app/services/postService.service';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-editmiembro',
  templateUrl: './editmiembro.component.html',
  styleUrls: ['./editmiembro.component.css']
})
export class EditmiembroComponent implements OnInit {
  data:any = sessionStorage.getItem('data');
  formularioVecino!: NgForm;
  // Creando la lista de miembros
  listVecinos: Vecino[] = [];
  // Rut del vecino seleccionado
  rutSeleccionado: string = '';
  fk_id_junta_vecinal!: string;
  // Creando el miembro seleccionado
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
    private auth:AuthService,
    private ComunaService: ComunaService,
    private deleteVecino: PostService,
    private updateVecino: PostService
  ) {}

  bytes:any = CryptoJS.AES.decrypt(this.data, this.auth.getKey()) ;
  org:any  = this.bytes.toString(CryptoJS.enc.Utf8);
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
        this.listVecinos = data.listVecinos.filter(({ fk_id_junta_vecinal}) => fk_id_junta_vecinal === idJuntaVec );
      },
      error => {
        console.log(error);
      }
    );
  }

  editarVecino(vecino: Vecino2) {
    this.vecinoSeleccionado = vecino;
  }

  seleccionarVecino(rut: string) {
    this.rutSeleccionado = rut;
    console.log("vecino seleccionado en el modal", this.rutSeleccionado);
  }

  salir() {
    setTimeout(function() {
      window.location.reload();
    }, 1000);
  }

  eliminarVecino(rut_vecino: string) {
    this.deleteVecino.deleteVecino(rut_vecino).subscribe(data => {
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
          Swal.fire(
            'Eliminado',
            'El vecino ha sido eliminado',
            'success'
            
          )
          this.listarMiembros();
        }
      })
    }, error => {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'No se pudo eliminar el vecino'
      })
      console.log(error);
    });
  }

  updateVecinos(vecino: Vecino2) {
    // Asignar el rut seleccionado al objeto vecinoSeleccionado
    this.vecinoSeleccionado.rut_vecino = this.rutSeleccionado;
  
    // Recorrer la lista de vecinos y asignar los valores a vecinoSeleccionado solo si no se han asignado previamente
    for (const vecino of this.listVecinos) {
      if (vecino.primer_nombre && !this.vecinoSeleccionado.primer_nombre) {
        this.vecinoSeleccionado.primer_nombre = vecino.primer_nombre;
      }
      if (vecino.segundo_nombre && !this.vecinoSeleccionado.segundo_nombre) {
        this.vecinoSeleccionado.segundo_nombre = vecino.segundo_nombre;
      }
      if (vecino.primer_apellido && !this.vecinoSeleccionado.primer_apellido) {
        this.vecinoSeleccionado.primer_apellido = vecino.primer_apellido;
      }
      if (vecino.segundo_apellido && !this.vecinoSeleccionado.segundo_apellido) {
        this.vecinoSeleccionado.segundo_apellido = vecino.segundo_apellido;
      }
      if (vecino.direccion && !this.vecinoSeleccionado.direccion) {
        this.vecinoSeleccionado.direccion = vecino.direccion;
      }
      if (vecino.telefono && !this.vecinoSeleccionado.telefono) {
        this.vecinoSeleccionado.telefono = vecino.telefono;
      }
      if (vecino.correo_electronico && !this.vecinoSeleccionado.correo_electronico) {
        this.vecinoSeleccionado.correo_electronico = vecino.correo_electronico;
      }
      if (vecino.contrasenia && !this.vecinoSeleccionado.contrasenia) {
        this.vecinoSeleccionado.contrasenia = vecino.contrasenia;
      }
    }
  
    // Fusionar los valores modificados con los valores actuales
    const updatedVecino: Vecino2 = { ...this.vecinoSeleccionado, ...vecino };

    Swal.fire({
      title: '¿Esta Seguro?',
      text: "Actualizara los datos del vecino",
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
          'vecino actualizado',
          'success'
        )
        this.updateVecino.updatevecino(vecino.rut_vecino, updatedVecino).subscribe(
          data => {
                console.log(data); // Maneja la respuesta del backend según tus necesidades
                this.listarMiembros();// Actualiza la lista de miembros después de la actualización
                setTimeout(function() {
                  window.location.reload();
                }, 1000); // 2000 milisegundos (2 segundos) para recargar la página
            // Cerrar el modal después de la actualización
            const modal = document.getElementById('disablebackdrop');
            if (modal) {
              modal.classList.remove('show');
              modal.style.display = 'none';
              modal.setAttribute('aria-hidden', 'true');
            }
            
          },
          error => {
            console.log("el error del update", error);
          }
        );
          
      }else{
        Swal.fire(
          'Cancelado',
          'vecino no actualizado',
          'error'
        )
        setTimeout(function() {
          window.location.reload();
        }, 1000);
        const modal = document.getElementById('disablebackdrop');
        if (modal) {
          modal.classList.remove('show');
          modal.style.display = 'none';
          modal.setAttribute('aria-hidden', 'true');
        }
      }
    })
  }
}
  
  
  

