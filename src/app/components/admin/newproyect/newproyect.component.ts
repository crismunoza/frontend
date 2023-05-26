import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ProyectoService } from 'src/app/services/proyecto.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Proyect } from 'src/app/interfaces/modelos';

@Component({
  selector: 'app-newproyect',
  templateUrl: './newproyect.component.html',
  styleUrls: ['./newproyect.component.css']
})
export class NewproyectComponent implements OnInit {
  
  formProyect: FormGroup;
  cupoMinimoControl: AbstractControl;
  cupoMaximoControl: AbstractControl;

  constructor(private formBuilder: FormBuilder, private proyectoService: ProyectoService, private router: Router) {
    this.formProyect = this.formBuilder.group({
      nombreProyecto: ['', [Validators.required, Validators.minLength(10), this.nameWhitoutNUMBERS]],
      cupoMinimo: [null, Validators.required],
      cupoMaximo: [null, [Validators.required, this.cupoMaximoValidator]],
      descripcion: ['',[Validators.required, this.descripcionValidator]],
      fecha: [null, [Validators.required, this.fechaValidator]],
      imagen: [null, Validators.required]
     
    });
    this.cupoMinimoControl = this.formProyect.get('cupoMinimo') as AbstractControl;
    this.cupoMaximoControl = this.formProyect.get('cupoMaximo') as AbstractControl;
    
    if (this.cupoMinimoControl && this.cupoMaximoControl) {
      this.cupoMinimoControl.valueChanges.subscribe(cupoMinimoValue =>
        this.cupoMaximoControl.setValue(cupoMinimoValue !== null ? cupoMinimoValue + 1 : null)
      );
    }
  }
  /**
   * 
   * @param control 
   * @returns true || null
   * Método que verifica que el nombre del proyecto no contenga números.
   */
  nameWhitoutNUMBERS(control: AbstractControl): ValidationErrors | null {
    const nombre = control.value;
    const regex = /^[^\d]+$/;
  
    if (nombre && !regex.test(nombre)) {
      return { nameWhitoutNUMBERS: true };
    }
  
    return null;
  }
  /**
   * 
   * @param control 
   * @returns true || null
   * Método que verifica que el cupo máximo sea mayor al cupo mínimo.
   */
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
  }
  cancelNumberInputMin(event: KeyboardEvent) {
    if (event.target) {
      const inputElement = event.target as HTMLInputElement;
      if (inputElement.value.length === 1 && event.key === 'Backspace') {
        event.preventDefault();
      }
    }
  }
  cancelNumberInput(event: KeyboardEvent) {
    event.preventDefault();
  }
  /**
   * 
   * @param control 
   * @returns true || null 
   * Método que controla la cantidad de palabras ingresadas en la descripción.
   */
  descripcionValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const words = value ? value.trim().split(/\s+/) : [];
    if (words.length < 7) {
      return { minWords: true };
    }
    return null;
  }
  /**
   * 
   * @param control 
   * @returns true || null
   * Método que verifica que la fecha seleccionada por el usuario sea la fecha actual
   */
  fechaValidator(control: AbstractControl): ValidationErrors | null {
    const selectedDate = new Date(control.value);
    const currentDate = new Date();
  
    // Establecer la zona horaria a GMT-4 para Chile
    currentDate.setUTCHours(currentDate.getUTCHours() - 4);
  
    const currentDateOptions = { timeZone: 'UTC' };
    const currentDateFormatted = currentDate.toLocaleDateString('es', currentDateOptions);
    const selectedDateFormatted = selectedDate.toLocaleDateString('es', currentDateOptions);
  
    if (selectedDate && selectedDateFormatted !== currentDateFormatted) {
      return { fechaInvalida: true };
    }
  
    return null;
  }
  addProyect() {
    if (this.formProyect.valid) {
      const formData: Proyect = {
        ...this.formProyect.value,
        fk_id_junta_vecinal: 1
      };
      this.proyectoService.insertProyect(formData).then(message => {
        Swal.fire({
          icon: 'success',
          title: 'Agregado',
          text: message.resp,
        }).then(() => {
          this.router.navigate(['editproyec']);
        });
      }).catch(error => {
        let messageAlert;
        
        messageAlert = error.errorType === 0 ? messageAlert = error.messageError: messageAlert = error.messageError;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: messageAlert,
        });
        // console.log(error)
      });
    }
  }
  ngOnInit() { }

  

  
}
