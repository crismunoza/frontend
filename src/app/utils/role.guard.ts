import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class RoleGuard implements CanActivate {
  constructor( private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | boolean {
    const expectedRole = route.data['role']; // Obtener el rol esperado por data del route
    const userRole = sessionStorage.getItem('rol');
    if (userRole !== undefined) {
      console.log('esta ingresando a q no viene vacio el userRole')
      // Verificar si el rol del usuario coincide con el rol esperado
      if (userRole == expectedRole) {
        return true; // Permitir el acceso a la ruta
      } 
      else {
        // Redireccionar a una página 404 de notfound
        this.router.navigate(['/pages-error404']); 
        return false;        
      }
    } else {
      // Redireccionar al inicio de sesión si el usuario no está autenticado
      this.router.navigate(['/login']); 
      return false;
    }
  }
}



