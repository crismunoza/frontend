import { Component, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common'
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  rol:any= localStorage.getItem('rol');
  avatar:any=sessionStorage.getItem('user_avatar');
  nombre:any=sessionStorage.getItem('nombre_us');
  constructor(@Inject(DOCUMENT) private document: Document, private auth:AuthService) { }

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
