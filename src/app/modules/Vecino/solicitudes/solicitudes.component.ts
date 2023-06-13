import { Component, OnInit } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { AuthService } from 'src/app/services/auth.service';
import { Solicitud2 } from '../../../interfaces/modelos';
import { ComunaService } from 'src/app/services/servi.service';

@Component({
  selector: 'app-solicitudes',
  templateUrl: './solicitudes.component.html',
  styleUrls: ['./solicitudes.component.css']
})
export class SolicitudesComponent implements OnInit {
  listsolicitud: Solicitud2[] = [];
  data: any = sessionStorage.getItem('data');
  fk_id_vecino!: string;

  constructor(
    private solicitudeslist: ComunaService,
    private auth: AuthService,
  ) { }
  bytes: any = CryptoJS.AES.decrypt(this.data, this.auth.getKey());
  org: any = this.bytes.toString(CryptoJS.enc.Utf8);
  obj: any = JSON.parse(this.org);

  id_vecino: string = this.obj.id;

  ngOnInit(): void {
    this.listarsolicitudes();
    console.log(this.listsolicitud);
  }

  listarsolicitudes() {
    const id_vecino = parseInt(this.id_vecino);

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
