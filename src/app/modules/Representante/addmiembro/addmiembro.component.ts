import { Component, OnInit } from '@angular/core';
import { Vecino4, RepresentanteVecinal, comuna } from 'src/app/interfaces/modelos';
import * as CryptoJS from 'crypto-js';
import { ComunaService } from 'src/app/services/servi.service';
import { PostService } from 'src/app/services/postService.service';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RutService } from 'rut-chileno';

@Component({
  selector: 'app-addmiembro',
  templateUrl: './addmiembro.component.html',
  styleUrls: ['./addmiembro.component.css']
})
export class AddmiembroComponent implements OnInit {
  data: any = sessionStorage.getItem('data');
  listVecinos: Vecino4[] = [];
  fk_id_junta_vecinal!: string;
  imageUrl: string | undefined;
  rep2!: FormGroup;
  submitted: boolean = false;
  selectedAvatar!: string;
  listcomunas: comuna[] = [];
  //aqui entregamos los nombre de los archivos de los avatars
  avatars: string[] = ['bear.png', 'cat.png', 'lion.png', 'meerkat.png', 'panda.png', 'polar-bear.png', 'sloth.png'];


  constructor(
    private auth: AuthService,
    private ComunaService: ComunaService,
    private deleteVecino: PostService,
    private modificarEstado: PostService,
    private fb: FormBuilder,
    private rutService: RutService,
    private junta: PostService,
  ) {
    this.rep2 = this.fb.group({
      run_rep: ["", [Validators.required, this.rutService.validaRutForm]],
      p_nomb_rep: ["", [Validators.required, Validators.pattern("^[a-zA-ZñÑ ]+$")]],
      s_nomb_rep: ["", [Validators.required, Validators.pattern("^[a-zA-ZñÑ ]+$")]],
      ap_pat_rep: ["", [Validators.required, Validators.pattern("^[a-zA-ZñÑ ]+$")]],
      ap_mat_rep: ["", [Validators.required, Validators.pattern("^[a-zA-ZñÑ ]+$")]],
      comuna_rep: new FormControl(null),
      calle_rep: ["", [Validators.required, Validators.pattern("^[a-zA-Z ]+$")]],
      num_calle_rep: ["", [Validators.required, Validators.pattern("^[0-9]\\d*$")]],
      contacto_Rep: ["", [Validators.required, Validators.pattern("^[0-9]{8}$")]],
      correo_rep: ["", [Validators.required, Validators.email, Validators.pattern(/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/)]],
      clave_rep: ["", [Validators.required]],
      clave_rep_conf: ["", [Validators.required]],
      selectedAvatar: new FormControl(null),
      evidencia: ["", [Validators.required]]
    });
  }

  bytes: any = CryptoJS.AES.decrypt(this.data, this.auth.getKey());
  org: any = this.bytes.toString(CryptoJS.enc.Utf8);
  obj: any = JSON.parse(this.org);
  id_junta: string = this.obj.id_junta_vec;

  ngOnInit(): void {
    this.ComunaService.cantRepresentantes(parseInt(this.id_junta)).subscribe(res => {
      console.log(res)
      if (res.status !== 200) {
        Swal.fire({
          icon: 'error',
          title: res.status,
          titleText: res.respuesta
        });
      }
      if (res.respuesta < 2) {
        let a = document.getElementById('addRep') ?? null;
        a?.removeAttribute("disabled");
      }

    });
    this.listarADD();
    this.ComunaService.getComunas().subscribe(
      (data: { listComunas: comuna[] }) => {
        this.listcomunas = data.listComunas;
      },
      error => {
        console.log(error); // Mostrar el error en la consola
      }
    );
  }
  onChangeAvatar() {
    this.selectedAvatar = this.rep2.controls['selectedAvatar'].value;
    console.log(this.selectedAvatar);
  }

  formatearRut2(event: Event): void {
    let rut = this.rutService.getRutChileForm(1, (event.target as HTMLInputElement).value)
    if (rut)
      this.rep2.controls['run_rep'].patchValue(rut, { emitEvent: false });
  }

  // rechazar vecino
  Rechazo(rut_vecino: string) {
    Swal.fire({
      title: '¿Desea rechazar al vecino?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Rechazar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          'Rechazado!',
          'El vecino ha sido rechazado.',
          'success'
        )
        this.deleteVecino.deleteVecino(rut_vecino).subscribe(data => {
          this.listarADD();
        }, error => {
          console.log(error);
        });
      } else {
        Swal.fire(
          'Cancelado!',
          'El vecino no ha sido rechazado.',
          'error'
        )
      }
    })
  }

  id_Junta: string = this.obj.id_junta_vec;
  //listar vecinos
  listarADD() {
    const idJuntaVec = parseInt(this.id_Junta); // Parsea a número y asigna 0 si es nulo

    this.ComunaService.listarADD().subscribe(
      data => {
        const vecinosConEvidencia1 = data.listVecinos.filter(({ fk_id_junta_vecinal, estado }) => fk_id_junta_vecinal === idJuntaVec && estado === 0);

        this.listVecinos = vecinosConEvidencia1;

        for (const vecino of this.listVecinos) {
          const base64String = vecino.ruta_evidencia;
          vecino.imageUrl = 'data:image/jpeg;base64,' + base64String;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  // aceptar vecino
  enviarRut(rut_vecino: string) {
    const estado = 1; // Valor del nuevo estado
    Swal.fire({
      title: '¿Desea aceptar al vecino?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          'Aceptado!',
          'El vecino ha sido aceptado.',
          'success'
        )
        // Realizar la llamada al backend para modificar el estado
        this.modificarEstado.modificarEstado(rut_vecino, estado).subscribe(data => {
          this.listarADD();
        }, error => {
          Swal.fire(
            'Error!',
            'Ha ocurrido algo inesperado intentelo más tarde.',
            'error'
          )
          console.log(error);
        });
      } else if (result.isDismissed) {
        Swal.fire(
          'Cancelado!',
          'El vecino no ha sido aceptado.',
          'error'
        )
      }
    })
  }

  abrirMod() {
    const mod = document.getElementById('modAddRep');
    //si es que se enecuntra
    if (mod) {
      //le agregaremos las clase show, lo deplegamos y le seteamos q ya no se encuentre escondido
      mod.classList.add('show');
      mod.style.display = 'block';
      mod.setAttribute('aria-hidden', 'false');
    }
  }

  closemodal() {
    //asiganmos el id del modal a una constatante (lo tratara como elementoHTML)
    const mod = document.getElementById('modAddRep');
    //si es que se enecuntra
    if (mod) {
      //le agregaremos las clase show, lo deplegamos y le seteamos q ya no se encuentre escondido
      mod.classList.add('hide');
      mod.style.display = 'none';
      mod.setAttribute('aria-hidden', 'true');
    }
    this.rep2.reset();
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.rep2.invalid || this.rep2.controls['clave_rep'].invalid || this.rep2.controls['clave_rep_conf'].invalid) {
      return;
    }
    const clave_veci = this.rep2.controls['clave_rep'].value;
    const clave_veci_conf = this.rep2.controls['clave_rep_conf'].value;

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
    else {
      const fileInput = document.getElementById('evidencia') as HTMLInputElement;
      const file = fileInput.files?.[0];

      if (file) {
        //FileReader permite almacenar ficheros de datos de forma asyncrona desde el navegador (img, videos, etc.)
        const reader = new FileReader();
        //cuando esta en cargado ya en el navegador
        reader.onload = () => {
          //convertimos la imagen o el reader a un string
          const base64Image = reader.result as string;

          const RepOne: RepresentanteVecinal = {
            rut_representante: this.rep2.controls['run_rep'].value,
            primer_nombre: this.rep2.controls['p_nomb_rep'].value,
            segundo_nombre: this.rep2.controls['s_nomb_rep'].value,
            primer_apellido: this.rep2.controls['ap_pat_rep'].value,
            segundo_apellido: this.rep2.controls['ap_mat_rep'].value,
            direccion_rep: this.rep2.controls['calle_rep'].value,
            numero_rep: this.rep2.controls['num_calle_rep'].value,
            correo_electronico: this.rep2.controls['correo_rep'].value,
            telefono: this.rep2.controls['contacto_Rep'].value,
            contrasenia: this.rep2.controls['clave_rep'].value,
            comuna_rep: this.rep2.controls['comuna_rep'].value,
            avatar: this.rep2.controls['selectedAvatar'].value,
            ruta_evidencia: 'hola.txt',
            ruta_firma: base64Image,
            id_junta_vecinal: parseInt(this.id_junta)
          };
          console.log("ESTO ESTOY MANDANDO",RepOne)
          this.junta.inserRep2(RepOne).subscribe(response => {
            if (response.msg === 'yes') {
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Generada con exito, Ahora puedes ingresar',
                showConfirmButton: false,
                timer: 2000
              }).then(() => {
                this.closemodal();
                window.location.reload();
              });

            }
            else {
              this.rep2.reset();
              Swal.fire({
                icon: 'error',
                title: 'Este rut pertenece a un representante en nuestro sistema'
              });
            }
          });
        };
        //esta da por finalizada la carga del archivo al navgador y la lista como DONE la tarea
        reader.readAsDataURL(file);
      }
    }
  }
}


