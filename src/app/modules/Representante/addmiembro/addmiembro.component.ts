import { Component, OnInit } from '@angular/core';
import { Vecino4,User} from 'src/app/interfaces/modelos';
import * as CryptoJS from 'crypto-js';
import { ComunaService } from 'src/app/services/servi.service';
import { PostService } from 'src/app/services/postService.service';

import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-addmiembro',
  templateUrl: './addmiembro.component.html',
  styleUrls: ['./addmiembro.component.css']
})
export class AddmiembroComponent implements OnInit {
  data:any = sessionStorage.getItem('data'); 
  listVecinos: Vecino4[] = [];
  fk_id_junta_vecinal!: string;
  imageUrl: string | undefined;

    // Resto del código de la clase...
  
  
  

  constructor(
    private auth:AuthService,
    private ComunaService: ComunaService,
    private deleteVecino: PostService,
    private modificarEstado: PostService,
  ) { }

  bytes:any = CryptoJS.AES.decrypt(this.data, this.auth.getKey()) ;
  org:any  = this.bytes.toString(CryptoJS.enc.Utf8);
  obj:any = JSON.parse(this.org);
  
  ngOnInit(): void {
    this.listarADD();
  }



// rechazar vecino
  Rechazo(rut_vecino: string) {
    Swal.fire({
      title: '¿Desea rechazar al vecino?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Rechazar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          'Rechazado!',
          'El vecino ha sido rechazado.',
          'success'
        )
        this.deleteVecino.deleteVecino(rut_vecino).subscribe(data => {
          this.listarADD();
        }, error => {
          console.log(error);
        });
      } else {
        Swal.fire(
          'Cancelado!',
          'El vecino no ha sido rechazado.',
          'error'
        )
      }
    })
  }



  id_Junta:string = this.obj.id_junta_vec;
 //listar vecinos
 listarADD() {
  const idJuntaVec = parseInt(this.id_Junta); // Parsea a número y asigna 0 si es nulo

  this.ComunaService.listarADD().subscribe(
    data => {
      const vecinosConEvidencia1 = data.listVecinos.filter(({ fk_id_junta_vecinal, estado }) => fk_id_junta_vecinal === idJuntaVec && estado === 0);

      this.listVecinos = vecinosConEvidencia1;

      for (const vecino of this.listVecinos) {
        const base64String = vecino.ruta_evidencia;
        vecino.imageUrl = 'data:image/jpeg;base64,' + base64String;
      }
    },
    error => {
      console.log(error);
    }
  );
}



 
  // aceptar vecino
  enviarRut(rut_vecino: string) {
    const estado = 1; // Valor del nuevo estado
   Swal.fire({
      title: '¿Desea aceptar al vecino?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          'Aceptado!',
          'El vecino ha sido aceptado.',
          'success'
        )
        // Realizar la llamada al backend para modificar el estado
        this.modificarEstado.modificarEstado(rut_vecino, estado).subscribe(data => {
          this.listarADD();
        }, error => {
          Swal.fire(
            'Error!',
            'Ha ocurrido algo inesperado intentelo más tarde.',
            'error'
          )
          console.log(error);
        });
      } else if (result.isDismissed) {
        Swal.fire(
          'Cancelado!',
          'El vecino no ha sido aceptado.',
          'error'
        )
      }
    })
  }
}


