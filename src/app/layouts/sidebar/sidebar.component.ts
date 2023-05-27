import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
 rol:any = localStorage.getItem('rol');
  constructor(protected router: Router) { }

  ngOnInit(): void {

  }

  navigate(ruta:any){
    console.log(ruta);    
    this.router.navigateByUrl(ruta);
  }

    
}