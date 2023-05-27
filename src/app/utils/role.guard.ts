import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class RoleGuard implements CanActivate {
  constructor( private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | boolean {
    const expectedRole = route.data['role']; // Obtener el rol esperado de la propiedad data del route
    console.log('que rol espera a comparar',expectedRole)
    const userRole = localStorage.getItem('rol');
    console.log('AAAAAAA',userRole)
    if (userRole !== '') {
      console.log('esta ingresando a q no viene vacio el userRole')
      // Verificar si el rol del usuario coincide con el rol esperado
      if (userRole == expectedRole) {
        console.log('se comparaan')
        return true; // Permitir el acceso a la ruta
      } else {
        this.router.navigate(['/login']); // Redireccionar a una página 404 de notfound
        return false;
      }
    } else {
      this.router.navigate(['/login']); // Redireccionar al inicio de sesión si el usuario no está autenticado
      return false;
    }
  }
}



// export class RoleGuard implements CanActivate {
//   //inyectar el servicio 
//   constructor(private router: Router) {

//    }
//   canActivate(
//     route: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
//     //obtenemos el rol desde el local storage

//     const RequiredRole = localStorage.getItem('rol');
//     console.log('desde el roleguard este rol recibe',rol)


//     if(rol === 'admin' || rol === 'vecino') {
//       //si no existe redireccionamos al login
//       return true;
//     }
//     this.router.navigate(['/login']);
//     return false;
//   }
  
// }
