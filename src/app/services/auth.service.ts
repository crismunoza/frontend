
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Login, User } from '../interfaces/modelos';
import { Router } from '@angular/router';

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
  const datosSesion1 = datos.id.toString();
  const datosSesion2 = datos.rut.toString();
  const datosSesion3 = datos.name.toString();
  const datoSesion4 = datos.avatar.toString();
  const datoSesion5 = datos.name.toString();
  const datoSesion6 = datos.apellido.toString();
   console.log('que envio de datos en user',datosSesion1,datosSesion2,datosSesion3)
// this.saveJuntaId(res);
//   const encryptedData = datosSesion1.toString('base64');
//   sessionStorage.setItem('data_user',encryptedData)
  sessionStorage.setItem('user_avatar',datoSesion4);
  sessionStorage.setItem('nombre_us',datoSesion5+' '+datoSesion6);
   sessionStorage.setItem('user_dataID' ,datosSesion1 );
   sessionStorage.setItem('user_datarut' ,datosSesion2 );
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

}
 