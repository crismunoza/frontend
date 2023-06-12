import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Publication } from '../interfaces/modelos';
import { Observable, map } from 'rxjs';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class PublicacionService {
  private myAppUrl = environment.endpoint;
  private myAppUrlInsertPublication = 'api/publicacion/agregar-publicacion';
  private myApiUrlGetAllPublications = 'api/publicacion/obtener-publicaciones/';
  private myApiUrlImagen = 'images/publicacion/';
  private myApiUrlUpdatePublication = 'api/publicacion/modificar-publicacion/';

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) { }
  
  insertPublicacion(dataPublication: any){
    return new Promise<Publication>((resolve, reject) => {
      this.http.post(`${this.myAppUrl}${this.myAppUrlInsertPublication}`, dataPublication)
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
    )
    
    }) 
  };

  getAllPublications(id_junta_vecinal: number): Observable<Publication[]> {
    return this.http.get<Publication[]>(`${this.myAppUrl}${this.myApiUrlGetAllPublications}${id_junta_vecinal}`)
  };

  getImagen(rutaImagen: string): Observable<SafeUrl> {
    return this.http.get(`${this.myAppUrl}${this.myApiUrlImagen}${rutaImagen}`, { responseType: 'blob' })
      .pipe(
        map((blob: Blob) => this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob)))
      );
  };

  updatePublication(id_actividad: number, data_plublicacion: any){
    return new Promise<Publication>((resolve, reject) => {
      this.http.put(`${this.myAppUrl}${this.myApiUrlUpdatePublication}${id_actividad}`, data_plublicacion)
      .subscribe(
        (response: any) => {
          console.log('enviado con éxito los datos al backend')
          resolve(response);
        },
        (error) => {
          let errorType = -1;
          let messageError;
        
        errorType = error.error.error.includes('0') ? 0 : error.error.error.includes('1') ? 1 : errorType;
        messageError = errorType !== -1 ? error.error.resp : undefined;
        //rechazo de la promesa.
        console.log('error al enviar los datos al backend')
        reject({ messageError, errorType });
        } 
      )
      
    })
  }
}
