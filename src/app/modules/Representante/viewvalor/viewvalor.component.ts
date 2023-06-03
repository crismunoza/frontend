import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import * as CryptoJS from 'crypto-js';
import { listValor } from 'src/app/interfaces/modelos';
import { AuthService } from 'src/app/services/auth.service';
import { ComunaService } from 'src/app/services/servi.service';

@Component({
  selector: 'app-viewvalor',
  templateUrl: './viewvalor.component.html',
  styleUrls: ['./viewvalor.component.css']
})
export class ViewvalorComponent implements OnInit, AfterViewInit {
  private oilChart!: Chart<any, any, any>;
  data:any = sessionStorage.getItem('data');
  listValoraciones: listValor[] = [];
  constructor(private elementRef: ElementRef,private auth:AuthService, private env:ComunaService) {
    Chart.register(...registerables);
  }
  bytes:any = CryptoJS.AES.decrypt(this.data, this.auth.getKey()) ;
  org:any  = this.bytes.toString(CryptoJS.enc.Utf8);
  obj:any = JSON.parse(this.org);

  id_Junta:string = this.obj.id_junta_vec;
  ngAfterViewInit(): void {
    if(this.id_Junta){
      const id = this.id_Junta;
      this.env.obtenerEstrellas(id).subscribe(res =>{
        //le entregamos a una constante la respuesta
        const estrellasArray = res.estrellas[0];
        //inicializamos el array
        const estrellasSeparadas = [];
        //recorremos el contenido que tiene cada texto {'1 estrella': 0, ....}, para incertarla enel array q inicializamos antes
        for (let i = 1; i <= 5; i++) {
          const cantidadEstrellas = estrellasArray[`${i} estrella`];
          estrellasSeparadas.push(cantidadEstrellas);
        }

        const a = estrellasSeparadas[0]; const b = estrellasSeparadas[1]; const c = estrellasSeparadas[2]; const d = estrellasSeparadas[3]; const e = estrellasSeparadas[4];
        const oilCanvas = this.elementRef.nativeElement.querySelector("#oilChart");

        if (oilCanvas) {
          const data = {
            labels: [
              '1',
              '2',
              '3',
              '4',
              '5'
            ],
            datasets: [{
              data: [a, b, c, d, e],
              backgroundColor: [
                'rgb(244, 67, 54)',
                'rgb(176, 190, 197)',
                'rgb(69, 179, 157)',
                'rgb(255, 235, 59)',
                'rgb(21, 101, 192 )'
              ],
              hoverOffset: 4
            }]
          };
          const config:any = {
            type: 'doughnut',
            data: data,
            options: {
              plugins: {
                  title: {
                      display: true,
                      text: 'Cantidad de Estrellas',
                      responsive: true
                  }
              }
          }
          };

          this.oilChart = new Chart(oilCanvas,config);
        }
      });

    }

  }

  ngOnInit(): void {

  }
  open_modal(){
    const a = parseInt(this.id_Junta);
    //asiganmos el id del modal a una constatante (lo tratara como elementoHTML)
    const mod = document.getElementById('mod_valoraciones');
    //si es que se enecuntra
    if(mod){
      //le agregaremos las clase show, lo deplegamos y le seteamos q ya no se encuentre escondido
      mod.classList.add('show');
      mod.style.display = 'block';
      mod.setAttribute('aria-hidden', 'false');
    }
    this.env.listaVecValoraciones(a).subscribe((data) =>{
     console.log(data)
    });

  }
  closemodal(){
    //asiganmos el id del modal a una constatante (lo tratara como elementoHTML)
    const mod = document.getElementById('mod_valoraciones');
    //si es que se enecuntra
    if(mod){
      //le agregaremos las clase show, lo deplegamos y le seteamos q ya no se encuentre escondido
      mod.classList.add('hide');
      mod.style.display = 'none';
      mod.setAttribute('aria-hidden', 'true');
    }
  }
}
