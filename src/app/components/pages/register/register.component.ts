import { Component, OnInit } from '@angular/core';
import {ComunaService} from '../../../services/servi.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  // inicializar variables


  constructor(
    private comunaService: ComunaService,
  ) { }
   
  ngOnInit(): void {
    
  }



}
