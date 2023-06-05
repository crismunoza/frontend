import { Component, OnInit } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { ProyectoService } from 'src/app/services/proyecto.service';

@Component({
  selector: 'app-proyectos',
  templateUrl: './proyectos.component.html',
  styleUrls: ['./proyectos.component.css']
})
export class ProyectosComponent implements OnInit {
  proyectos: any[] = [];
  imagenUrls: { [rutaImagen: string]: SafeUrl } = {};
  proyectosActivos: string[] = [];
  statusProyect: string = 'ACTIVO';
  constructor(private proyectoService: ProyectoService) { }

  ngOnInit(): void {
    this.proyectoService.getAllProyect().subscribe(data => {
      this.proyectos = data;
      console.log(data);

      this.proyectosActivos = this.proyectos.filter(proyecto => proyecto.estado === 'ACTIVO');

      for (const proyecto of this.proyectos) {
        this.proyectoService
          .getImagen(proyecto.ruta_imagen)
          .subscribe(url => {
            this.imagenUrls[proyecto.ruta_imagen] = url;
          });
      }
    });
    
  };

}
