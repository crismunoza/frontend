import { JuntaVecinal, RepresentanteVecinal, Valoracion, Vecino } from './../interfaces/modelos';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  //variables para la url del backend
  private myAppUrl: string;
  private myApiUrl: string;

  constructor(private http: HttpClient) {
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api';
  }

  //metodo de insercion de la junta vecinal
  insertJuntaVecinal(junta: JuntaVecinal): Observable<any> {
    return this.http.post(`${this.myAppUrl}${this.myApiUrl}/juntavecinal`, junta);
  }
// insertar nuevo representante vecinal
  inserRep(Rep: RepresentanteVecinal): Observable<any> {
    return this.http.post(`${this.myAppUrl}${this.myApiUrl}/juntavecinal/insercion`, Rep);
  }
// insert del segundo representate vecinal
  inserRep2(Rep: RepresentanteVecinal): Observable<any> {
    return this.http.post(`${this.myAppUrl}${this.myApiUrl}/juntavecinal/insercion2`, Rep);
  }

  // registro de vecinos del modulo de registro de vecinos
  insertvecino(Vecino: Vecino): Observable<any> {
    return this.http.post(`${this.myAppUrl}${this.myApiUrl}/insertvecino`, Vecino);
  }

  // delete y update del modulo de editar de vecinos
  deleteVecino(rut_vecino: string): Observable<any> {
    return this.http.delete(`${this.myAppUrl}${this.myApiUrl}/insertvecino/deletevecino/${rut_vecino}`);
  }
    
  deletereprese(rut_representante: string, idJuntaVec: number): Observable<any> {
      const url = `${this.myAppUrl}${this.myApiUrl}/users/deleterepre`;
    // Crea un objeto con los datos a enviar al backend
    const data = {
      rut_representante: rut_representante,
      idJuntaVec: idJuntaVec
    };
    return this.http.post(url, data);
  }
  // update del modulo de editar de vecinos
  updatevecino(rut_vecino: string, Vecino: any): Observable<any> {
    return this.http.put(`${this.myAppUrl}${this.myApiUrl}/insertvecino/updatevecino/${rut_vecino}`, Vecino);
  }
  updatereprese(rut_representante: string, RepresentanteVecinal: any): Observable<any> {
    return this.http.put(`${this.myAppUrl}${this.myApiUrl}/juntavecinal/repreupdate/${rut_representante}`, RepresentanteVecinal);
  }
  // delete del modulo de aceptar vecinos
  noacepptado(rut_vecino: string): Observable<any> {
    return this.http.delete(`${this.myAppUrl}${this.myApiUrl}/insertvecino/noacepptado/${rut_vecino}`);
  }
  // update del modulo de aceptar vecinos
  modificarEstado(rut_vecino: string, estado: number): Observable<any> {
    const url = `${this.myAppUrl}${this.myApiUrl}/insertvecino/modificarEstado`;

    // Crea un objeto con los datos a enviar al backend
    const data = {
      rut_vecino: rut_vecino,
      estado: estado
    };

    return this.http.post(url, data);
  }

  //metodo de insercion de la solicitud
  newsolicitud(newsolicitud: any): Observable<any> {
    return this.http.post(`${this.myAppUrl}${this.myApiUrl}/solicitudes`, newsolicitud);
  }

  //metodo de update de la solicitud por parte del representante
  updateSolicitud(id_solicitud: number, solicitud: any): Observable<any> {
    return this.http.put(`${this.myAppUrl}${this.myApiUrl}/solicitudes/update/${id_solicitud}`, solicitud);
  }

  enviarSol(val: Valoracion): Observable<any> {
    return this.http.post(`${this.myAppUrl}${this.myApiUrl}/valoraciones/enviar`, val);
  }
  // servicio de restablecer contraseña
  cambiarContrasena(rut: string, correo_electronico: string): Observable<any> {
    const url = `${this.myAppUrl}${this.myApiUrl}/reset/cambiarcontra`;

    // Crea un objeto con los datos a enviar al backend
    const data = {
      rut: rut,
      correo_electronico: correo_electronico
    };

    return this.http.post(url, data);
  }


  //eliminar un representante en especifico y en su pantalla de perfil
  deleteUser(id: number, id_junta: number): Observable<any> {
    const url = `${this.myAppUrl}${this.myApiUrl}/users/delete`;
    const data = {
      id: id,
      id_junta: id_junta, // Pasamos los parámetros de consulta aquí
    };

    return this.http.post(url, data);
  }



}



