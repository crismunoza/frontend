import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CertificadoService {

    private myAppUrl = environment.endpoint;
    private myApiUrl = 'api/certificados/generate-pdf';
    private myApiUrlUpdate = 'api/certificados/update-subtitle';
    private myApiUrlUParagraph = 'api/certificados/obtener-parrafo';
    private myApiUrlSenRut = 'api/certificados/obtener-rut';
    private myApiUrlSendEmail = 'api/certificados/enviar-correo';

  constructor(private http: HttpClient) { }
  /**promesa que obtiene el certificado desde backend.*/
  downloadPDF(): Promise<any> {
    const url = `${this.myAppUrl}${this.myApiUrl}`;
  
    return this.http.get(url, { responseType: 'blob' })
      .toPromise()
      .then((response: Blob | undefined) => {
        if (response) {
          const blob = new Blob([response], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'certificadojuntavecinal.pdf';
          link.click();
          window.URL.revokeObjectURL(url);
        }
      });
  }
  //**promesa que actualiza el certificado en backend mediante la petición post. */
  updateSubtitle(payload: any) {
    return new Promise((resolve, reject) => {
      this.http.post(`${this.myAppUrl}${this.myApiUrlUpdate}`, payload)
        .subscribe(
          () => {
            resolve('');
          },
          (error) => {
            reject('Error al actualizar el subtítulo: ' + error);
          }
        );
    });
  }

  getParagraph() {
    return new Promise((resolve, reject) => {
      this.http.get(`${this.myAppUrl}${this.myApiUrlUParagraph}`)
        .toPromise()
        .then(response => {
          resolve(response); 
        })
        .catch(error => {
          reject(error); 
        });
    });
  }

  sendRut(rutVecino: string) {
    return new Promise((resolve, reject) => {
      this.http.post(`${this.myAppUrl}${this.myApiUrlSenRut}`, { rutVecino })
      .subscribe(
        response => {
          resolve(response);
        },
         error => {
          reject(error);
        }
      )
    })
  };

  Enviocerti(): Promise<any> {

    return this.http.post(`${this.myAppUrl}${this.myApiUrlSendEmail}`, {}).toPromise();
  };
}  
