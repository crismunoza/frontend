import { Component, OnInit } from '@angular/core';
import { Vecino,User} from 'src/app/interfaces/modelos';
import { ComunaService } from 'src/app/services/servi.service';
import { PostService } from 'src/app/services/postService.service';

@Component({
  selector: 'app-addmiembro',
  templateUrl: './addmiembro.component.html',
  styleUrls: ['./addmiembro.component.css']
})
export class AddmiembroComponent implements OnInit {
  listVecinos: Vecino[] = [];
  idJuntaVec: string | null;
  fk_id_junta_vecinal!: string;
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
    this.deleteVecino.noacepptado(rut_vecino).subscribe(data => {
      this.listarADD();
    }, error => {
      console.log(error);
    });
  }
 //listar vecinos
 listarADD() {
  const idJuntaVec = parseInt(sessionStorage.getItem('user_dataID') || '0', 10); // Parsea a número y asigna 0 si es nulo

  this.ComunaService.listarADD().subscribe(
    data => {
      console.log("data", data);
      const vecinosConEvidencia1 = data.listVecinos.filter(({ fk_id_junta_vecinal, estado }) => fk_id_junta_vecinal === idJuntaVec && estado === 0);
      console.log("vecinosConEvidencia1", vecinosConEvidencia1);
      this.listVecinos = vecinosConEvidencia1;
    },
    error => {
      console.log(error);
    }
  );
}

 
  // aceptar vecino
  enviarRut(rut_vecino: string) {
    const estado = 1; // Valor del nuevo estado
  
    // Realizar la llamada al backend para modificar el estado
    this.modificarEstado.modificarEstado(rut_vecino, estado).subscribe(
      data => {
        console.log(data); // Maneja la respuesta del backend según tus necesidades
        this.listarADD(); // Actualiza la lista de miembros después de la modificación
      },
      error => {
        console.log("Error al modificar el estado:", error);
      }
    );
  }

}


