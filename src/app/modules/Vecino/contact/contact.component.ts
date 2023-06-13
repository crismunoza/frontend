import { Component, OnInit } from '@angular/core';
import { contacto } from '../../../interfaces/modelos';
import * as CryptoJS from 'crypto-js';
import { AuthService } from 'src/app/services/auth.service';
import { ComunaService } from 'src/app/services/servi.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  vercontacto: contacto[] = [];
  data: any = sessionStorage.getItem('data');

  constructor(
    private solicitudeslist: ComunaService,
    private auth: AuthService,
  ) { }
  bytes: any = CryptoJS.AES.decrypt(this.data, this.auth.getKey());
  org: any = this.bytes.toString(CryptoJS.enc.Utf8);
  obj: any = JSON.parse(this.org);


  ngOnInit(): void {
    this.vercontactos();
    console.log(this.vercontacto);
  }

  id_junta_vecinal: string = this.obj.id_junta_vec;
  vercontactos() {
    const id_junta_vecinal = parseInt(this.id_junta_vecinal);

    this.solicitudeslist.getContactos(id_junta_vecinal).subscribe(
      (response: any) => {
        if (response.data) {
          this.vercontacto = response.data;

        }
      },
      error => {
        console.log(error);
      }
    );
  }
}
