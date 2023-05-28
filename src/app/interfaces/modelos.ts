export interface Municipalidad{
   id_municipalidad: number;
  nombre: string;
};


export interface comuna{
    id_comuna: number;
    nombre: string;
};

export interface JuntaVecinal {
  id_comuna: number;
  razon_social: string;
  direccion: string;
  numero_calle: number;
  rut_junta: string;
};

export interface JuntaVecinal2 {
  id_junta_vecinal: number;
  razon_social: string;
};

export interface RepresentanteVecinal {
  rut_representante: string,
  primer_nombre: string,
  segundo_nombre: String,
  primer_apellido: String,
  segundo_apellido: String,
  direccion_rep: String,
  numero_rep: Number,
  correo_electronico: String,
  telefono: Number;
  contrasenia: String,
  comuna_rep: Number,
  avatar:string,
  ruta_evidencia: string,
  ruta_firma: string,
  id_junta_vecinal: Number
};

export interface Vecino {
  rut_vecino: string,
  primer_nombre: string,
  segundo_nombre: String,
  primer_apellido: String,
  segundo_apellido: String,
  direccion: String,
  correo_electronico: String,
  telefono: Number;
  contrasenia: String,
  avatar:string,
  ruta_evidencia: string,
  estado: Number,
  fk_id_junta_vecinal: Number,
};

export interface Vecino2 {
  rut_vecino: string,
  primer_nombre: string,
  segundo_nombre: string,
  primer_apellido: string,
  segundo_apellido: string,
  direccion: string,
  correo_electronico: string,
  telefono: number,
  contrasenia: string
};


export interface Proyect {

  nombreProyecto : string;
  cupoMinimo : number;
  cupoMaximo : number;
  descripcion : string;
  fecha : string;
  imagen : string;
  resp?: string;

};
export interface Login{
  rut: string,
  contrasenia: string,
  tipo_user: boolean
};
export interface User {
  id: String,
  name: String,
  apellido: string,
  rut: String,
  avatar: string,
  id_junta_vec: number
};