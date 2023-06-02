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
  //aqui empleareos las variables que se llamaran mientra se crea la pag
  data:any = sessionStorage.getItem('data');
  //inicializamos las variables q usaremos para desencryptar
  bytes:any;  org:any;  obj:any; avatar1:string | undefined; nombre:string | undefined;
  constructor(@Inject(DOCUMENT) private document: Document, private auth:AuthService) {     
  }
  //desencryptar la data
  
   
  ngOnInit(): void {
    
    if(this.data){
      this.bytes = CryptoJS.AES.decrypt(this.data, this.auth.getKey()) ;
    this.org  = this.bytes.toString(CryptoJS.enc.Utf8);
    this.obj = JSON.parse(this.org);
    //se la entregamos a las ocntantes que las va a usar este componente
    this.avatar1  = this.obj.avatar;
    this.nombre = this.obj.name+' '+this.obj.apellido; 
    }
    
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
