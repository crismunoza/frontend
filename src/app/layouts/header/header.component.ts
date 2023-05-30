import { Component, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common'
import { AuthService } from 'src/app/services/auth.service';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  rol:any= sessionStorage.getItem('rol');
  //avatar:any= avatar1;
  //nombre:any=sessionStorage.getItem('nombre_us');
  //aqui empleareos las variables que se llamaran mientra se crea la pag
  data:any =sessionStorage.getItem('data');
  constructor(@Inject(DOCUMENT) private document: Document, private auth:AuthService) {     
  }
  //desencryptar la data
  bytes:any  = CryptoJS.AES.decrypt(this.data, this.auth.getKey()) ;
  org:any  = this.bytes.toString(CryptoJS.enc.Utf8);
  obj = JSON.parse(this.org);
  //se la entregamos a las ocntantes que las va a usar este componente
  avatar1:string  = this.obj.avatar;
  nombre:string = this.obj.name+' '+this.obj.apellido;  
  ngOnInit(): void {
  }

  logOut(){
    localStorage.setItem('access_token','');
    sessionStorage.clear();
    this.auth.logout();
  }
  sidebarToggle()
  {
    //toggle sidebar function
    this.document.body.classList.toggle('toggle-sidebar');
  }
}
