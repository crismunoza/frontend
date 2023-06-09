import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ajustePerfil } from '../interfaces/modelos';

@Injectable({
  providedIn: 'root'
})
export class UpdateService {

  private myAppUrl: string;
  private myApiUrl: string;

  constructor(private http: HttpClient) {
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api';
  }
  updatePerfiles(id_us: any, datos: ajustePerfil): Observable<any> {
    return this.http.put(`${this.myAppUrl}${this.myApiUrl}/users/update-perfil/${id_us}`, datos);
  }
  UpdateClave(id: number, datos: any): Observable<any> {
    return this.http.put(`${this.myAppUrl}${this.myApiUrl}/users/update-clave/${id}`, datos);
  }
}
