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
  nombre:any=sessionStorage.getItem('nombre_us');
  //aqui empleareos las variables que se llamaran mientra se crea la pag
  data:any =sessionStorage.getItem('data');
  
  bytes:any  = CryptoJS.AES.decrypt(this.data, 'CHINGADOS') ;
  org:any  = this.bytes.toString(CryptoJS.enc.Utf8);
  obj = JSON.parse(this.org);
  avatar1:string  = this.obj.avatar;

  constructor(@Inject(DOCUMENT) private document: Document, private auth:AuthService) { 
    console.log('que viene en data ',this.data)
    console.log('como queda desencriptado ',this.org)
    
  }

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
