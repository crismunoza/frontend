import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Solicitud2 } from '../../../interfaces/modelos';
import { ComunaService } from 'src/app/services/servi.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-solicitudes',
  templateUrl: './solicitudes.component.html',
  styleUrls: ['./solicitudes.component.css']
})
export class SolicitudesComponent implements OnInit {
  listsolicitud: Solicitud2[] = [];
  id_vecino: string | null;
  fk_id_vecino!: string;

  constructor(
    private solicitudeslist: ComunaService,
  ) {
    this.id_vecino = sessionStorage.getItem('user_dataID');
  }

  ngOnInit(): void {
    this.listarsolicitudes();
    console.log(this.listsolicitud);
  }

  listarsolicitudes() {
    const id_vecino = parseInt(sessionStorage.getItem('user_dataID') || '0', 10);
  
    this.solicitudeslist.getsolicitudes().subscribe(
      (response: any) => {
        console.log("data", response.data);
        if (response.data) {
          this.listsolicitud = response.data;
          this.listsolicitud = this.listsolicitud.filter((solicitud: Solicitud2) => solicitud.fk_id_vecino === id_vecino);
        }
      },
      error => {
        console.log(error);
      }
    );
  }
}
