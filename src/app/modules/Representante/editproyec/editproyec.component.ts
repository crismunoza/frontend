import { Component, OnInit } from '@angular/core';
import { Proyect } from 'src/app/interfaces/modelos';
import { ProyectoService } from 'src/app/services/proyecto.service';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import Swal from 'sweetalert2';
import * as CryptoJS from 'crypto-js';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-editproyec',
  templateUrl: './editproyec.component.html',
  styleUrls: ['./editproyec.component.css']
})
export class EditproyecComponent implements OnInit {
  proyectos: Proyect[] = [];
  status: string[] = [];
  selectedStatus: string = '';
  editarFormVisible: boolean = false;
  formProyect: FormGroup;
  statusValidate: string = 'CERRADO';
  estados: string[] = [];
  data: any = sessionStorage.getItem('data');

  constructor(private proyectoService: ProyectoService, private formBuilder: FormBuilder, private auth: AuthService) {
    this.formProyect = this.formBuilder.group({
      idProyecto: [null],
      nombreProyecto: ['', [Validators.required, Validators.minLength(10), this.nameWhitoutNUMBERS]],
      cupoMinimo: [null, Validators.required],
      cupoMaximo: [null, [Validators.required]],
      descripcion: ['', [Validators.required, this.descripcionValidator]],
      estado: ['', [Validators.required, Validators.minLength(6), this.nameWhitoutNUMBERS]],

    });

  }
  bytes: any = CryptoJS.AES.decrypt(this.data, this.auth.getKey());
  org: any = this.bytes.toString(CryptoJS.enc.Utf8);
  obj: any = JSON.parse(this.org);

  id_junta_vecinal: string = this.obj.id_junta_vec;

  nameWhitoutNUMBERS(control: AbstractControl): ValidationErrors | null {
    const nombre = control.value;
    const regex = /^[^\d]+$/;

    if (nombre && !regex.test(nombre)) {
      return { nameWhitoutNUMBERS: true };
    }

    return null;
  };

  cancelNumberInputMin(event: KeyboardEvent) {
    if (event.target) {
      const inputElement = event.target as HTMLInputElement;
      if (inputElement.value.length === 1 && event.key === 'Backspace') {
        event.preventDefault();
      }
    }
  };
  cancelNumberInput(event: KeyboardEvent) {
    event.preventDefault();
  };

  descripcionValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const words = value ? value.trim().split(/\s+/) : [];
    if (words.length < 7) {
      return { minWords: true };
    }
    return null;
  };

  getAllProyects() {
    this.proyectoService.getAllProyect(parseInt(this.id_junta_vecinal))
      .subscribe(
        (response) => {
          this.proyectos = response;
          this.loadVecinosInscritos();
        },
        (error) => {
          console.log(error);
        }
      )
  };

  loadVecinosInscritos() {
    this.proyectos.forEach((proyecto) => {
      this.proyectoService.getVecinosInscritos(proyecto.id_proyecto).subscribe((count) => {
        // console.log(proyecto)
        proyecto.inscritos = count;
      });
    });
  };

  loadProyectDetails(proyect: any) {
    this.formProyect.patchValue({
      idProyecto: proyect.id_proyecto,
      nombreProyecto: proyect.nombre,
      cupoMinimo: proyect.cupo_min,
      cupoMaximo: proyect.cupo_max,
      descripcion: proyect.descripcion,
      estado: proyect.estado
    });
  };

  submitProyect() {
    if (this.formProyect.invalid) {
      console.log('llega a que es c¿valido')
      const proyectId = this.formProyect.value.idProyecto;
      const proyectData = {
        nombre: this.formProyect.value.nombreProyecto,
        cupo_min: this.formProyect.value.cupoMinimo,
        cupo_max: this.formProyect.value.cupoMaximo,
        descripcion: this.formProyect.value.descripcion,
        estado: this.formProyect.value.estado
      };
      console.log(proyectData)
      this.proyectoService.updateProyect(proyectId, proyectData)
        .then(message => {
          Swal.fire({
            icon: 'success',
            title: 'Modificado',
            text: message.resp,
          })
            .then(() => {
              window.location.reload();
            })
        })
        .catch(error => {
          let messageAlert;

          messageAlert = error.errorType === 0 ? messageAlert = error.messageError : messageAlert = error.messageError;
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: messageAlert,
          });
          console.error(error);
        });
    }
  };

  deleteProyect(proyect: any): void {
    Swal.fire({
      icon: 'question',
      title: 'Eliminar proyecto',
      text: '¿Está seguro de que desea eliminar el proyecto?',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.proyectoService.deleteProyect(proyect.id_proyecto)
          .then(message => {
            Swal.fire({
              icon: 'warning',
              title: 'Eliminado',
              text: message.resp,
            }).then(() => {
              window.location.reload();
            })
          })
          .catch(error => {
            let messageAlert;
            messageAlert = error.errorType === 0 ? error.messageError : error.messageError;
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: messageAlert,
            });
            console.error(error);
          });
      }
    });
  };

  getFilters() {
    this.proyectoService.getFilters().subscribe(
      response => {
        this.status = response;
      },
      error => {

      }
    );
  };

  filterProyects(valor: string) {
    const filtro = valor ? { estado: valor } : null;

    this.proyectoService.filtrarProyectos(filtro).subscribe(
      response => {
        this.proyectos = response;
        this.loadVecinosInscritos();
      },
      error => {
        console.error(error);
      }
    );
  };

  downloadExcel(id_proyecto: number, nombre_proyecto: string) {
    this.proyectoService.downloadExcel(id_proyecto, nombre_proyecto)
  };

  getFiltersForMODIFY() {
    this.proyectoService.getFiltersForModify().subscribe(
      estados => {
        this.estados = estados;
      },
      error => {
        console.error(error);
      }
    );
  };

  getRut(): string {
    const accessToken = localStorage.getItem('access_token');
    let rut = '';
    if (accessToken) {
      const payload = accessToken.split('.')[1];
      const decodedPayload = atob(payload);
      const userData = JSON.parse(decodedPayload);
      rut = userData.rut_user;
    } else {
      console.log('No se encontró el token');
    }
    return rut
  };
  ngOnInit() {
    this.getAllProyects();
    this.getFilters();
    this.getFiltersForMODIFY();
    this.getRut();
    // this.proyectoService.sendRut(this.getRut().toString());
  }

}
