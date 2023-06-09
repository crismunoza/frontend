import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RutService } from 'rut-chileno';
import { comuna, JuntaVecinal2, Vecino } from '../../../interfaces/modelos';
import { ComunaService } from '../../../services/servi.service';
import { PostService } from '../../../services/postService.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  parentForm!: FormGroup;
  submitted = false;
  selectedAvatar!: string;
  selectedJuntaVecinalId: number | null = null; // Nueva propiedad para almacenar el ID de la junta vecinal seleccionada
  comunaRazon!: string;
  avatars: string[] = ['bear.png', 'cat.png', 'lion.png', 'meerkat.png', 'panda.png', 'polar-bear.png', 'sloth.png'];
  listcomunas: comuna[] = [];
  listJuntaVecinal: JuntaVecinal2[] = [];

  constructor(
    private fb: FormBuilder,
    private rutService: RutService,
    private comunaService: ComunaService,
    private vecino: PostService,
    private router: Router
  ) { }

  formatearRut(event: Event): void {
    let rut = this.rutService.getRutChileForm(1, (event.target as HTMLInputElement).value)
    if (rut)
      this.parentForm.controls['rut_vecino'].patchValue(rut, { emitEvent: false });
  }

  ngOnInit(): void {
    this.parentForm = this.fb.group({
      rut_vecino: ["", [Validators.required, this.rutService.validaRutForm]],
      p_nomb_veci: ["", [Validators.required, Validators.pattern("^[a-zA-ZñÑ ]+$")]],
      s_nomb_veci: ["", [Validators.required, Validators.pattern("^[a-zA-ZñÑ ]+$")]],
      ap_pat_veci: ["", [Validators.required, Validators.pattern("^[a-zA-ZñÑ ]+$")]],
      ap_mat_veci: ["", [Validators.required, Validators.pattern("^[a-zA-ZñÑ ]+$")]],
      comuna_junta: new FormControl(null),
      dirreccion_veci: ["", [Validators.required, Validators.pattern("^[a-zA-ZñÑ0-9 ]+$")]],
      telefono: ["", [Validators.required, Validators.pattern("^[0-9]{8}$")]],
      correo_veci: ["", [Validators.required, Validators.email, Validators.pattern(/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/)]],
      clave_veci: ["", [Validators.required]],
      clave_veci_conf: ["", [Validators.required]],
      selectedAvatar: new FormControl(null),
      evidencia: ["", [Validators.required]]
    });

    this.comunaService.getComunas().subscribe(
      (data: { listComunas: comuna[] }) => {
        this.listcomunas = data.listComunas;
      },
      error => {
        console.log(error);
      }
    );
  }

  onComunaSelected(event: any) {
    const fk_id_comuna = event.target.value;
    this.comunaService.getJuntaVecinalByComunaId(fk_id_comuna).subscribe(
      (data: { listJuntaVecinal: JuntaVecinal2[] }) => {
        this.listJuntaVecinal = data.listJuntaVecinal;
        console.log("onComunaSelected", this.listJuntaVecinal);

        const length = this.listJuntaVecinal.length; // Obtener la longitud de la lista
        if (length > 0) {
          const idJuntaVecinal = this.listJuntaVecinal[0].id_junta_vecinal; // Utilizar la propiedad correcta
          console.log("ID Junta Vecinal:", idJuntaVecinal);
          // Aquí puedes realizar cualquier otra acción con el ID de la junta vecinal
        } else {
          console.log("La lista de juntas vecinales está vacía.");
        }
      },
      error => {
        console.log('Error al obtener las juntas vecinales:', error);
      }
    );
  }

  onchangeJuntavecinal(event: any) {
    const selectedValue = parseInt(event.target.value);
    this.selectedJuntaVecinalId = selectedValue !== 0 ? selectedValue : null; // Asignar null si el valor seleccionado es cero
    console.log("onchangeJuntavecinal", this.selectedJuntaVecinalId);
    console.log("evento del onchange", event); // Verificar el valor seleccionado en la consola
  }

  onChangeAvatar() {
    this.selectedAvatar = this.parentForm.controls['selectedAvatar'].value;
  }

  onSubmit() {
    this.submitted = true;

    if (this.parentForm.invalid || this.parentForm.controls['clave_veci'].invalid || this.parentForm.controls['clave_veci_conf'].invalid) {
      return;
    }
    const clave_veci = this.parentForm.controls['clave_veci'].value;
    const clave_veci_conf = this.parentForm.controls['clave_veci_conf'].value;

    if (clave_veci !== clave_veci_conf) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Las contraseñas no coinciden',
        showConfirmButton: false,
        timer: 2000
      });
      return;
    }

    const fileInput = document.getElementById('evidencia') as HTMLInputElement;
    const file = fileInput?.files?.[0];

    if (!file) {
      console.log('No se ha seleccionado ningún archivo');
      // Manejar el caso en que no se seleccionó ningún archivo, como mostrar un mensaje de error o realizar alguna acción específica.
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      const base64String = reader.result as string;
      const Vecino: Vecino = {
        rut_vecino: this.parentForm.controls['rut_vecino'].value,
        primer_nombre: this.parentForm.controls['p_nomb_veci'].value,
        segundo_nombre: this.parentForm.controls['s_nomb_veci'].value,
        primer_apellido: this.parentForm.controls['ap_pat_veci'].value,
        segundo_apellido: this.parentForm.controls['ap_mat_veci'].value,
        direccion: this.parentForm.controls['dirreccion_veci'].value,
        correo_electronico: this.parentForm.controls['correo_veci'].value,
        telefono: this.parentForm.controls['telefono'].value,
        contrasenia: this.parentForm.controls['clave_veci'].value,
        avatar: this.parentForm.controls['selectedAvatar'].value,
        ruta_evidencia: base64String, // Utiliza la cadena Base64 completa
        estado: 0,
        fk_id_junta_vecinal: this.selectedJuntaVecinalId || 0, // Utilizar el ID de la junta vecinal seleccionada
      };
      let rut = this.parentForm.controls['rut_vecino'].value;
      this.comunaService.verificarsiexiste(rut).subscribe(res => {
        if (res.msg === 'correo existe') {
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Rut Se Encuentra Registrado',
            showConfirmButton: false,
            timer: 2000
          })
        } else if (res.msg === 'no esta') {
          // Aquí puedes manejar el mensaje recibido en el bloque else if
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Registro Correctamente!!',
            showConfirmButton: false,
            timer: 1000
          }).then((result) => {
            this.vecino.insertvecino(Vecino).subscribe({
              next: (v) => {
                if (v.msg == 'Se inserto correctamente') {
                }
                this.router.navigate(['/login']);
              },
              error: (error) => {
                Swal.fire({
                  position: 'center',
                  icon: 'error',
                  title: 'Error al registrarse',
                  showConfirmButton: false,
                  timer: 1000
                });
              }
            });
          });

        }
      }, error => {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'no se pudo verificar el rut',
          showConfirmButton: false,
          timer: 2000
        });
        console.log('Error al obtener las juntas vecinales:', error);
      });


    };

    reader.onerror = () => {
      console.error('Error al leer el archivo');
    };

    reader.readAsDataURL(file);
  }

  navigate(ruta: any) {
    this.router.navigateByUrl(ruta);
  }
}
