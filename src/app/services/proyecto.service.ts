import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Proyect } from '../interfaces/modelos';

@Injectable({
  providedIn: 'root'
})
export class ProyectoService {

  private myAppUrl = environment.endpoint;
  private myApiUrlInsert = 'api/proyectos/agregar-proyecto';
  constructor(private http: HttpClient) { }

  insertProyect(dataProyect: any) {
    return new Promise<Proyect>((resolve, reject) => {
      this.http.post(`${this.myAppUrl}${this.myApiUrlInsert}`, dataProyect)
        .subscribe(
          (response: any) => {
            resolve(response);
          },
          (error) => {
            let errorType = -1;
            let messageError;
          
          errorType = error.error.error.includes('0') ? 0 : error.error.error.includes('1') ? 1 : errorType;
          messageError = errorType !== -1 ? error.error.resp : undefined;
          //rechazo de la promesa.
          reject({ messageError, errorType }); 
          }
        );
    });
  }
}
