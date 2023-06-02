import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import * as CryptoJS from 'crypto-js';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PostService } from 'src/app/services/postService.service';
import Swal from 'sweetalert2';
import { Valoracion } from 'src/app/interfaces/modelos';

@Component({
  selector: 'app-valoracion',
  templateUrl: './valoracion.component.html',
  styleUrls: ['./valoracion.component.css']
})
export class ValoracionComponent implements OnInit {
  solicitud!:FormGroup;  
  data:any = sessionStorage.getItem('data');  

  constructor(private auth:AuthService,private fb:FormBuilder,private post:PostService) { 
  }
  bytes:any = CryptoJS.AES.decrypt(this.data, this.auth.getKey()) ;
  org:any  = this.bytes.toString(CryptoJS.enc.Utf8);
  obj:any = JSON.parse(this.org);
 
  id_vecino:string = this.obj.id;
  
    //se la entregamos a las ocntantes que las va a usar este componente
  ngOnInit(): void {
    this.solicitud = this.fb.group({
      opinion: ["", Validators.required]
    });
  }

  stars: number[] = [1, 2, 3, 4, 5];
  rating: number = 0;
  hoverRating: number = 0;

  rate(value: number) {
    this.rating = value;
  }
  enter(starIndex: number) {
    this.hoverRating = starIndex;
  }
  leave() {
    this.hoverRating = 0;
  }
  submit(){
    const opinion = this.solicitud.controls['opinion'].value;
    const estrellas = this.rating;
    const id_v = parseInt(this.id_vecino);

    const val : Valoracion = {
      opinion: opinion,
      estrellas: estrellas,
      id_v: id_v
    }
    this.post.enviarSol(val).subscribe(res =>{
      if(res.msg == 'ok'){
        this.solicitud.reset();
        this.rating = 0;
        Swal.fire({
          icon: 'success',
          text: 'Gracias por tu tiempo, emos enviando tu Valorizacíon correctamente', 
          showConfirmButton: false,
          timer: 2000
        });
        
      }
      else{
         Swal.fire({
          icon: 'error',
          text: 'Lo sentimos a ocurrido un error, contactanos si persiste'
         });
      }
    });
  }
}
