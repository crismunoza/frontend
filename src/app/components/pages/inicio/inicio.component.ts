import { Component, OnInit } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { Publication } from 'src/app/interfaces/modelos';
import { PublicacionService } from 'src/app/services/publicacion.service';
import * as CryptoJS from 'crypto-js';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
  publications: Publication[] = [];
  imagenUrls: { [rutaImagen: string]: SafeUrl } = {};
  data: any = sessionStorage.getItem('data');

  constructor(private publicacionService: PublicacionService, private auth: AuthService) { }

  bytes: any = CryptoJS.AES.decrypt(this.data, this.auth.getKey());
  org: any = this.bytes.toString(CryptoJS.enc.Utf8);
  obj: any = JSON.parse(this.org);

  id_junta_vecinal: string = this.obj.id_junta_vec;
  ngOnInit(): void {
    this.publicacionService.getAllPublications(parseInt(this.id_junta_vecinal))
      .subscribe(
        data => {
          this.publications = data;

          for (const publication of this.publications) {
            this.publicacionService
              .getImagen(publication.ruta_imagen)
              .subscribe(url => {
                this.imagenUrls[publication.ruta_imagen] = url;
              });
          };
        }
      )
  }

}
