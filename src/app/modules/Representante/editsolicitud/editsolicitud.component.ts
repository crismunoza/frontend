import { Component,ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as CryptoJS from 'crypto-js';
import { Solicitud3,Solicitud4 } from '../../../interfaces/modelos';
import { ComunaService } from 'src/app/services/servi.service';
import {PostService} from '../../../services/postService.service';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-editsolicitud',
  templateUrl: './editsolicitud.component.html',
  styleUrls: ['./editsolicitud.component.css']
})
export class EditsolicitudComponent implements OnInit {
  @ViewChild('verticalycentered') modal: ElementRef | undefined;
  estadosSolicitud = [
    { id: 'Aceptada', nombre: 'Aceptada' },
    { id: 'Rechazada', nombre: 'Rechazada' }
  ];
  selectedSolicitudId!: number;
  selectedSolicitud!: Solicitud3 | undefined;
  listsolicitud: Solicitud3[] = [];
  data:any = sessionStorage.getItem('data');
  fk_id_junta_vecinal!: string;
  parentForm!: FormGroup;
  submitted = false;
  solicitudRespondida: boolean = false;



  constructor(
    private auth:AuthService,
    private fb: FormBuilder,
    private RespondSolicitud: PostService,
    private solicitudeslist: ComunaService,
  ) {}
  bytes:any = CryptoJS.AES.decrypt(this.data, this.auth.getKey()) ;
  org:any  = this.bytes.toString(CryptoJS.enc.Utf8);
  obj:any = JSON.parse(this.org);

  id_Junta:string = this.obj.id_junta_vec;

  ngOnInit(): void {
    this.parentForm = this.fb.group({
      estado_solicitud: [""],
      respuesta: ["", [Validators.required, Validators.pattern("^[a-zA-ZñÑ ]+$")]],
    });
    this.solicitudes();
    console.log("esto trae la array ", this.solicitudes);
  }

  openModal(idSolicitud: number): void {
    this.selectedSolicitud = this.listsolicitud.find(solicitud => solicitud.id_solicitud === idSolicitud);
    this.solicitudRespondida = !!this.selectedSolicitud?.respuesta;
    console.log("idSolicitud", idSolicitud);
  }

  salir() {
    if (this.modal) {
      this.modal.nativeElement.classList.remove('show');
      this.modal.nativeElement.style.display = 'none';
      this.modal.nativeElement.setAttribute('aria-hidden', 'true');
    }
    this.parentForm.reset();
  }




updateSolicitud(): void {
    if (this.parentForm.invalid) {
      return;
    }
    const solicitud:Solicitud4 = {
      id_solicitud: this.selectedSolicitud?.id_solicitud || 0,
      estado_solicitud: this.parentForm.controls['estado_solicitud'].value,
      respuesta: this.parentForm.controls['respuesta'].value,
    };
    this.RespondSolicitud.updateSolicitud(solicitud.id_solicitud,solicitud).subscribe(
      response => {
        console.log(response);
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Solicitud actualizada',
          showConfirmButton: false,
          timer: 1500
        }).then(() => {
          this.parentForm.reset();
          window.location.reload();
        });
      },
      error => {
        console.log(error);
      }
    );
  }

  solicitudes() {
    const idJuntaVec = parseInt(this.id_Junta);
    console.log("id_junta_vecinal", idJuntaVec);
    this.solicitudeslist.versolicitudes().subscribe(
      (response: any) => {
        console.log("data", response.data);
        if (response.data) {
          this.listsolicitud = response.data;
          console.log("lista", this.listsolicitud);
          this.listsolicitud = this.listsolicitud.filter((solicitud: Solicitud3) => solicitud.fk_id_junta_vecinal === idJuntaVec);
        }
      },
      error => {
        alert("Error en la petición");
        console.log("Aqui estamos en el error",error);
        console.log(error);
      }
    );
  }
}
