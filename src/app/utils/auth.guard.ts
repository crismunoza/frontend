import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  //inyectar el servicio 
  constructor(private router: Router) {

   }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    //verificamos si existe el token
    const token = localStorage.getItem('access_token');
    if(!token) {
      //si no existe redireccionamos al login
      this.router.navigate(['/login'])
    }
    return true;
  }
  
}
