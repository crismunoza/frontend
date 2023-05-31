import { Component, OnInit } from '@angular/core';
import { Proyect } from 'src/app/interfaces/modelos';
import { ProyectoService } from 'src/app/services/proyecto.service';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-editproyec',
  templateUrl: './editproyec.component.html',
  styleUrls: ['./editproyec.component.css']
})
export class EditproyecComponent implements OnInit {
  proyectos: Proyect[] =  [];
  status: string[] = [];
  selectedStatus: string = '';
  editarFormVisible: boolean = false;
  formProyect: FormGroup;
  cupoMinimoControl: AbstractControl;
  cupoMaximoControl: AbstractControl;
  
  constructor(private proyectoService: ProyectoService, private formBuilder: FormBuilder) {
    this.formProyect = this.formBuilder.group({
      idProyecto:[null],
      nombreProyecto: ['', [Validators.required, Validators.minLength(10), this.nameWhitoutNUMBERS]],
      cupoMinimo: [null, Validators.required],
      cupoMaximo: [null, [Validators.required, this.cupoMaximoValidator]],
      descripcion: ['',[Validators.required, this.descripcionValidator]],
      estado: ['', [Validators.required, Validators.minLength(6), this.nameWhitoutNUMBERS]],
     
    });
    this.cupoMinimoControl = this.formProyect.get('cupoMinimo') as AbstractControl;
    this.cupoMaximoControl = this.formProyect.get('cupoMaximo') as AbstractControl;
    
    if (this.cupoMinimoControl && this.cupoMaximoControl) {
      this.cupoMinimoControl.valueChanges.subscribe(cupoMinimoValue =>
        this.cupoMaximoControl.setValue(cupoMinimoValue !== null ? cupoMinimoValue + 1 : null)
      );
    }
   }
   nameWhitoutNUMBERS(control: AbstractControl): ValidationErrors | null {
    const nombre = control.value;
    const regex = /^[^\d]+$/;
  
    if (nombre && !regex.test(nombre)) {
      return { nameWhitoutNUMBERS: true };
    }
  
    return null;
  };
  
  cupoMaximoValidator(control: AbstractControl): ValidationErrors | null {
    const cupoMinimoValue = control.root.get('cupoMinimo')?.value;
    const cupoMaximoValue = control.root.get('cupoMaximo')?.value;
    
    if (cupoMinimoValue !== null && cupoMaximoValue !== null) {
      if (cupoMaximoValue <= cupoMinimoValue) {
        const errors = { cupoMaximoInvalido: true };
        return errors;
      }
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
    this.proyectoService.getAllProyect()
    .subscribe(
      (response) => {
        this.proyectos = response;
      },
      (error) => {
        console.log(error);
      }
    )
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
    if (this.formProyect.valid) {
      const proyectId = this.formProyect.value.idProyecto;
      const proyectData = {
        nombre: this.formProyect.value.nombreProyecto,
        cupo_min: this.formProyect.value.cupoMinimo,
        cupo_max: this.formProyect.value.cupoMaximo,
        descripcion: this.formProyect.value.descripcion,
        estado: this.formProyect.value.estado
      };
      this.proyectoService.updateProyect(proyectId, proyectData)
        .then(message => {
          Swal.fire({
            icon: 'success',
            title: 'Modificado',
            text: message.resp,
          })
        })
        .catch(error => {
          let messageAlert;
        
          messageAlert = error.errorType === 0 ? messageAlert = error.messageError: messageAlert = error.messageError;
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
            });
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
      },
      error => {
        console.error(error);
      }
    );
  };
  
  ngOnInit() {
    this.getAllProyects();
    this.getFilters();
  }

}
