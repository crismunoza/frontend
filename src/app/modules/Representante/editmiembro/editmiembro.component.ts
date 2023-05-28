import { Component, OnInit } from '@angular/core';
import { Vecino, Vecino2 } from 'src/app/interfaces/modelos';
import { ComunaService } from 'src/app/services/servi.service';
import { PostService } from 'src/app/services/postService.service';

@Component({
  selector: 'app-editmiembro',
  templateUrl: './editmiembro.component.html',
  styleUrls: ['./editmiembro.component.css']
})
export class EditmiembroComponent implements OnInit {
  // Creando la lista de miembros
  listVecinos: Vecino[] = [];
  // Rut del vecino seleccionado
  rutSeleccionado: string = '';
  idJuntaVec: string | null;
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
    private ComunaService: ComunaService,
    private deleteVecino: PostService,
    private updateVecino: PostService
  ) { this.idJuntaVec = sessionStorage.getItem('user_dataID');}

  ngOnInit(): void {
    this.listarMiembros();
    console.log(this.listVecinos);
  }

  // listarMiembros() {
  //   this.ComunaService.getvecinos().subscribe(data => {
  //     this.listVecinos = data.listVecinos;
  //   }, error => {
  //     console.log(error);
  //   });
  // }

  listarMiembros() {
    const idJuntaVec = parseInt(sessionStorage.getItem('user_dataID') || '0', 10); // Parsea a número y asigna 0 si es nulo
  
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
  }

  eliminarVecino(rut_vecino: string) {
    this.deleteVecino.deleteVecino(rut_vecino).subscribe(data => {
      this.listarMiembros();
    }, error => {
      console.log(error);
    });
  }

  updateVecinos(vecino: Vecino2) {
    // Asignar el rut seleccionado al objeto vecinoSeleccionado
    this.vecinoSeleccionado.rut_vecino = this.rutSeleccionado;

    const Vecino = {
      primer_nombre: vecino.primer_nombre,
      segundo_nombre: vecino.segundo_nombre,
      primer_apellido: vecino.primer_apellido,
      segundo_apellido: vecino.segundo_apellido,
      direccion: vecino.direccion,
      correo_electronico: vecino.correo_electronico,
      telefono: vecino.telefono,
      contrasenia: vecino.contrasenia
    };

    console.log("el vecino", vecino);
    this.updateVecino.updatevecino(vecino.rut_vecino, Vecino).subscribe(data => {
      console.log(data); // Maneja la respuesta del backend según tus necesidades
      this.listarMiembros(); // Actualiza la lista de miembros después de la actualización
    }, error => {
      console.log("el error del update", error);
    });
  }
}
