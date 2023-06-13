import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio-general',
  templateUrl: './inicio-general.component.html',
  styleUrls: ['./inicio-general.component.scss']
})
export class InicioGeneralComponent implements OnInit {
  document: any;

  constructor(private router:Router) { }

  ngOnInit(): void {
  }
  navigate(ruta:any){
    console.log(ruta);
    this.router.navigateByUrl(ruta);
  }

}
