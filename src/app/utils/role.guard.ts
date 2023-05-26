import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  //inyectar el servicio 
  constructor(private router: Router) {

   }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    //obtenemos el rol desde el local storage
    const rol = localStorage.getItem('rol');
    console.log('desde el roleguard este rol recibe',rol)
   // const routePath = state.url;
    
    // if (rol === 'vecino' && routePath.includes('/vecino')) {
    //   return true;
    // }
    
    // if (rol === 'admin' && routePath.includes('/admin')) {
    //   return true;
    // }

    if(rol === 'admin' || rol === 'vecino') {
      //si no existe redireccionamos al login
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
  
}
