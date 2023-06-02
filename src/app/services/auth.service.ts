
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Login, User } from '../interfaces/modelos';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private myAppUrl: string;
  private myApiUrl: string;

  constructor(private http: HttpClient,private router:Router) {
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api';
  }

  login(log : Login ): Observable<any> {
    return this.http.post<any>(`${this.myAppUrl}${this.myApiUrl}/users/ingresar`, log)
    .pipe(
      tap((res:any) => {
        if(res.respuesta === 'ok'){
          localStorage.setItem('access_token', res.alo[1]);
          sessionStorage.setItem('rol',res.alo[2]);
          this.getUserProfile(res.alo[0],res.alo[2]).subscribe((res) => {
            this.saveUserData(res.datos); // Guardar datos del usuario en el localStorage
          }); 
          var respuesta = res.alo[2];
         return respuesta; 
        }
            
         
      })
    );
}

saveUserData(user:any): void {
  //todavia sigo trabajandoen esto ... debo encriptar 
  const datos: User ={
    id: user[0],    
    rut: user[1],
    name: user[2],
    apellido: user[3],
    avatar: user[4],
    id_junta_vec: user[5]
  }
  //encriptaremos datos 
  const dataString = JSON.stringify(datos);
  const key = this.getKey();
  var ciphertext = CryptoJS.AES.encrypt(dataString, key).toString();
 
   console.log('esto queda en data ',ciphertext)
  //almacenamos en la session la data encriptada
   sessionStorage.setItem('data',ciphertext);
}

logout(): void {
  // Limpiar token y rol
  localStorage.removeItem('access_token');
  // Redireccionar al login
  this.router.navigate(['login']);
}


  getUserProfile(id:any,rol:any): Observable<any> {
    return this.http.get<any>(`${this.myAppUrl}${this.myApiUrl}/users/profile?id=${id}&rol=${rol}`);
  }

  getKey(){
    const llave : string = 'CHINGADOS';
    return llave;
  }

}
 