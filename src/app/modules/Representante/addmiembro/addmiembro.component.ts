import { Component, OnInit } from '@angular/core';
import { Vecino4,User} from 'src/app/interfaces/modelos';
import { ComunaService } from 'src/app/services/servi.service';
import { PostService } from 'src/app/services/postService.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-addmiembro',
  templateUrl: './addmiembro.component.html',
  styleUrls: ['./addmiembro.component.css']
})
export class AddmiembroComponent implements OnInit {
  listVecinos: Vecino4[] = [];
  idJuntaVec: string | null;
  fk_id_junta_vecinal!: string;
  imageUrl: string | undefined;

    // Resto del código de la clase...
  
  
  

  constructor(
    private ComunaService: ComunaService,
    private deleteVecino: PostService,
    private modificarEstado: PostService,
  ) { this.idJuntaVec = sessionStorage.getItem('user_dataID');}
  
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




 //listar vecinos
 listarADD() {
  const idJuntaVec = parseInt(sessionStorage.getItem('user_dataID') || '0', 10); // Parsea a número y asigna 0 si es nulo

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
      } else {
        Swal.fire(
          'Cancelado!',
          'El vecino no ha sido aceptado.',
          'error'
        )
      }
    })
  }
}


