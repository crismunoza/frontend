import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pages-error404',
  templateUrl: './pages-error404.component.html',
  styleUrls: ['./pages-error404.component.css']
})
export class PagesError404Component implements OnInit {

  constructor(private r:Router) { }

  ngOnInit(): void {
  }
  navegar(){
    console.log('entra por el boton')
    const toke = localStorage.getItem('access_token');
    //necesitamos epecificar que tiene que venir algo en session para redireccionarlo al inicio de user
    const rol = sessionStorage.getItem('rol');
    if(toke !== '' && rol !== null){
      this.r.navigate(['inicio']);
    }
    else {
      this.r.navigate(['inicio-general']);
    }
  }
}
