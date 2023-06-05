import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Proyect } from '../interfaces/modelos';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';


@Injectable({
  providedIn: 'root'
})
export class ProyectoService {

  private myAppUrl = environment.endpoint;
  private myApiUrlInsert = 'api/proyectos/agregar-proyecto';
  private myApiUrlGetAllProyect = 'api/proyectos/obtener-proyectos';
  private myApiUrlGetFilters = 'api/proyectos/filtro-proyectos';
  private myApiUrlGetProyectsWithFilters = 'api/proyectos/obtener-proyectos-filtros';
  private myApiUrlUpdateProyect = 'api/proyectos/modificar-proyecto/';
  private myApiUrlDeleteProyect = 'api/proyectos/eliminar-proyecto/';
  private myApiUrlImagen = 'images/proyectos/';
  constructor(private http: HttpClient, private sanitizer: DomSanitizer) { }

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
  getAllProyect(): Observable<Proyect[]> {
    return this.http.get<Proyect[]>(`${this.myAppUrl}${this.myApiUrlGetAllProyect}`)
  };

  getFilters(): Observable<string[]>{
    return this.http.get<string[]>(`${this.myAppUrl}${this.myApiUrlGetFilters}`)
  };
  filtrarProyectos(filtro: any): Observable<Proyect[]> {
    return this.http.post<Proyect[]>(`${this.myAppUrl}${this.myApiUrlGetProyectsWithFilters}`, filtro)
    .pipe(
      map(response => {
        if (response.length > 0) {
          return response;
        } else {
          throw new Error("No se encontraron proyectos según el filtro especificado");
        }
      }),
      catchError(error => {
        if (error instanceof HttpErrorResponse) {
          if (error.status === 404) {
            throw new Error("No se encontraron proyectos según el filtro especificado");
          } else {
            throw new Error("Error al filtrar proyectos");
          }
        } else {
          throw new Error("Error al filtrar proyectos");
        }
      })
    );
  };

  updateProyect(idProyecto: number, data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.put(`${this.myAppUrl}${this.myApiUrlUpdateProyect}${idProyecto}`, { id_proyecto: idProyecto, ...data })
        .subscribe(
          response => {
            resolve(response);
          },
          error => {
            let errorType = -1;
            let messageError;
          
          errorType = error.error.error.includes('0') ? 0 : error.error.error.includes('1') ? 1 : errorType;
          messageError = errorType !== -1 ? error.error.resp : undefined;
          //rechazo de la promesa.
          reject({ messageError, errorType });
          }
        );
    });
  };

  deleteProyect(idProyecto: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.delete(`${this.myAppUrl}${this.myApiUrlDeleteProyect}${idProyecto}`)
      .subscribe(
        response => {
          resolve(response);
        },
        error => {
          let errorType = -1;
            let messageError;
          
          errorType = error.error.error.includes('0') ? 0 : error.error.error.includes('1') ? 1 : errorType;
          messageError = errorType !== -1 ? error.error.resp : undefined;
          //rechazo de la promesa.
          reject({ messageError, errorType });
        }
      );
    });
  };

  getImagen(rutaImagen: string): Observable<SafeUrl> {
    return this.http.get(`${this.myAppUrl}${this.myApiUrlImagen}${rutaImagen}`, { responseType: 'blob' })
      .pipe(
        map((blob: Blob) => this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob)))
      );
  };

}
