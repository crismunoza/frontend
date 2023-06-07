import { Component, OnInit } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { ProyectoService } from 'src/app/services/proyecto.service';
import Swal from 'sweetalert2';

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

  getRut(): string{
    const accessToken = localStorage.getItem('access_token');
      let rut = '';
      if (accessToken) {
        const payload = accessToken.split('.')[1];
        const decodedPayload = atob(payload);
        const userData = JSON.parse(decodedPayload);
        rut = userData.rut_user;
      } else {
        console.log('No se encontró el token');
      }
      return rut
  }
  register(idProyecto: number) {
    this.proyectoService.insertReport(idProyecto, this.getRut(), 'SI')
    .then(message => {
      Swal.fire({
        icon: 'success',
        title: 'Inscrito',
        text: message.resp,
      }).then(() => {
        window.location.reload();
      })
    }).catch(error => {
      let messageAlert;
      messageAlert = error.errorType === 0 ? messageAlert = error.messageError: messageAlert = error.messageError;
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: messageAlert,
      });
    });
    
  };

  refuse(idProyecto: number) {
    Swal.fire({
      icon: 'question',
      title: 'Rechazar proyecto',
      text: '¿Estás seguro que deseas rechazar este proyecto?',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.proyectoService.insertReport(idProyecto, this.getRut(), 'NO')
        .then(message => {
          Swal.fire({
            icon: 'error',
            title: 'Rechazado',
            text: message.resp,
          }).then(() => {
            window.location.reload();
          })
        })
      }
    });
};

  ngOnInit(): void {
    this.proyectoService.getAllProyect().subscribe(data => {
      this.proyectos = data;

      this.proyectosActivos = this.proyectos.filter(proyecto => proyecto.estado === 'ACTIVO');

      for (const proyecto of this.proyectos) {
        this.proyectoService
          .getImagen(proyecto.ruta_imagen)
          .subscribe(url => {
            this.imagenUrls[proyecto.ruta_imagen] = url;
          });
      };

      for (const proyecto of this.proyectos) {
        this.proyectoService.getVecinosInscritos(proyecto.id_proyecto).subscribe((count) => {
          proyecto.vecinosInscritos = count;
        });
      }
    });

    this.proyectoService.getReport(this.getRut()).subscribe(reports => {
      //verifica si el vecino está inscrito en cada proyecto.
      for (const proyecto of this.proyectos) {
        const reporteEncontrado = reports.find((report: any) => report.fk_id_proyecto === proyecto.id_proyecto);
        proyecto.inscrito = reporteEncontrado && (reporteEncontrado.inscrito === 'SI' || reporteEncontrado.inscrito === 'NO');
        
      }
    });
    
    
  };

}
