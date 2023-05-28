import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
//import { Login } from 'src/app/interfaces/modelos';
import Swal from 'sweetalert2';
import { Login } from 'src/app/interfaces/modelos';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  login!:FormGroup; //formulario distinto de null

  submit: boolean = false; 
  constructor(private router:Router,private fb:FormBuilder, private loggin: AuthService
   , ) { }

  ngOnInit(): void {
    this.login = this.fb.group({
      username: ["", [Validators.required]],
      password: ["", [Validators.required]],
      rol_us: false
    });
    
  }
  onSubmit(){
    this.submit = true;
    if(this.login.invalid){
      return;
    }
    else{
      //captura del dato y envio al metodo login
      //const c = this.login.controls['rememberMe'].value;
      const datos: Login ={
        rut: this.login.controls['username'].value,
        contrasenia: this.login.controls['password'].value,
        tipo_user: this.login.controls['rol_us'].value
      }

      console.log('lo q enviamos',datos)
      try {
          this.loggin.login(datos).subscribe( res =>{

            if(res.status === 500 ){
              Swal.fire({
                icon: 'error',
                text: res.respuesta
              })
            }
            else if(res.status === 404){
              Swal.fire({
                icon: 'error',
                text: res.respuesta
              })
            }
            else{
              if(res.alo[2] === 'admin'){
                console.log('va a redireccionar hacia admin ')
                Swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: 'Ingreso Exitoso!!',
                  showConfirmButton: false,
                  timer: 1500
                }).then(() => {
                  /* Read more about isConfirmed, isDenied below */
                  this.router.navigate(['inicio']);
              })
              }
              else if(res.alo[2] === 'vecino'){
                console.log('va a redireccionar hacia vecino ')
                Swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: 'Ingreso Exitoso!!',
                  showConfirmButton: false,
                  timer: 1500
                }).then(() => {
                  /* Read more about isConfirmed, isDenied below */
                  this.router.navigate(['inicio']);
              })

              }
            }
          
        });
      }catch (error) {
        console.error('Error al parsear la respuesta JSON:', error);
      }  
      
    }
  }

  //aqui indicamos la funcion de navigate la cual recibe una ruta y nos direcciona
  navigate(ruta:any){ 
    this.router.navigateByUrl(ruta);
  }
}
