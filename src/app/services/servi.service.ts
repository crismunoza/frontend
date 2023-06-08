
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {Vecino, comuna, Solicitud, reportes, listValor} from '../interfaces/modelos';
import {JuntaVecinal2} from '../interfaces/modelos';

@Injectable({
  providedIn: 'root'
})
export class ComunaService {
    //variables para la url del backend
    private myAppUrl: string;
    private myApiUrl: string;
  constructor(private http: HttpClient) {
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api';
    //this.myApiUrl = 'api/juntavecinal';
  }
    //metodo para traer los comentarios y este deja listar con ngFor
    getComunas(): Observable<{ listComunas: comuna[] }> {
      return this.http.get<{ listComunas: comuna[] }>(`${this.myAppUrl}${this.myApiUrl}/comunas`);
    }

    //metodo para llevar las juntas vecinales que estan ligadas a las comunas
    getJuntaVecinalByComunaId(fk_id_comuna: string): Observable<any> {
      return this.http.get<any>(`${this.myAppUrl}${this.myApiUrl}/juntavecinal/mostrarjunta/${fk_id_comuna}`);
    }

    // trae a todos los miembros que estan en estado 1 que estan activos modulo de editar vecinos
    getvecinos(): Observable<{ listVecinos: Vecino[] }> {
      // Añade un parámetro a la URL para filtrar los vecinos con evidencia número 1
      const url = `${this.myAppUrl}${this.myApiUrl}/insertvecino/listVecinos?estado=1`;

      return this.http.get<{ listVecinos: Vecino[] }>(url);
    }


    // trae a todos los miembros que estan en estado 0 que es inactivo modulo de aceptar vecinos
    listarADD(): Observable<{ listVecinos: Vecino[] }> {
      const url = `${this.myAppUrl}${this.myApiUrl}/insertvecino/listarADD?estado=0`;

      return this.http.get<{ listVecinos: Vecino[] }>(url);
    }
    // trae la lista de todas las solicitudes
    getsolicitudes(): Observable<{ listsolicitud: Solicitud[] }> {
      return this.http.get<{ listsolicitud: Solicitud[] }>(`${this.myAppUrl}${this.myApiUrl}/solicitudes/listsolicitud`);
    }
    // trae la lista de todas las solicitudes para responder
    versolicitudes(): Observable<{ data: Solicitud[] }> {
      return this.http.get<{ data: Solicitud[] }>(`${this.myAppUrl}${this.myApiUrl}/solicitudes/versolicitudes`);
    }

    obtenerEstrellas(id:any):Observable<any>{
      return this.http.get<any[]>(`${this.myAppUrl}${this.myApiUrl}/valoraciones/obtenerStar/${id}`);
    }


    listaVecValoraciones(id_junta:number):Observable<{data : listValor[]}>{
      return this.http.get<{data: listValor[]}>(`${this.myAppUrl}${this.myApiUrl}/valoraciones/listarValoraciones/${id_junta}`);

    }
    // mostrar lista de reportes
    verreporte(): Observable<{ listreportes: reportes[] }> {
      return this.http.get<{ listreportes: reportes[] }>(`${this.myAppUrl}${this.myApiUrl}/reporte/verreporte`);
    }

    // mostrar lista de reportes
    generarReporte(id_junta_vecinal: number): Observable<Blob> {
      return this.http.get(`${this.myAppUrl}${this.myApiUrl}/reporte/CrearReport/${id_junta_vecinal}`, { responseType: 'blob' });
    }


    // metodo para verificar si el rut ya esta registrado
    verificarRut(rut: string): Observable<any> {
      return this.http.get<any>(`${this.myAppUrl}${this.myApiUrl}/reset/${rut}`);
    }

  //  metodo para verificar si el correo ya esta registrado
   verificarCorreo(correo_electronico: string): Observable<any> {
    return this.http.get<any>(`${this.myAppUrl}${this.myApiUrl}/reset/vericorreo/${correo_electronico}`);

   }
   
   // metodo para verificar si el rut ya esta registrado
   verificarsiexiste (rut: string): Observable<any> {
    return this.http.get<any>(`${this.myAppUrl}${this.myApiUrl}/insertvecino/verificarsiexiste/${rut}`);
   }

    getUserData(id:any,rol:any,id_junta:any):Observable<any>{
      return this.http.get<any>(`${this.myAppUrl}${this.myApiUrl}/users/data?id=${id}&rol=${rol}&junta=${id_junta}`);
    }


    //metodo para traer los contactos de la base de datos del componente contacto
    getContactos(id_junta_vecinal: any): Observable<any> {
      return this.http.get<any>(`${this.myAppUrl}${this.myApiUrl}/vercontacto/${id_junta_vecinal}`);
    }
}




