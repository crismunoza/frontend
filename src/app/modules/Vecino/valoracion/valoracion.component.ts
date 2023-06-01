import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import * as CryptoJS from 'crypto-js';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-valoracion',
  templateUrl: './valoracion.component.html',
  styleUrls: ['./valoracion.component.css']
})
export class ValoracionComponent implements OnInit {
  solicitud!:FormGroup;  
  data:any = sessionStorage.getItem('data');
  

  constructor(private auth:AuthService,private fb:FormBuilder) { 
  }
  bytes:any = CryptoJS.AES.decrypt(this.data, this.auth.getKey()) ;
  org:any  = this.bytes.toString(CryptoJS.enc.Utf8);
  obj:any = JSON.parse(this.org);
 
  id_junta:string = this.obj.id_junta_vec;
  
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
    const a = this.solicitud.controls['opinion'].value;
    const b = this.rating;

    const c = [] = [a,b];
  }
}
