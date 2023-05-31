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

  idProyecto : number;
  nombre: string;
  cupoMinimo : number;
  cupoMaximo : number;
  descripcion : string;
  fecha_proyecto : string;
  imagen : string;
  estado: string;
  resp?: any;

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

export interface Solicitud {
  titulo_solicitud: string,
  asunto_solicitud: string,
  descripcion: string,
  estado_solicitud: string,
  fk_id_vecino: number
};

export interface Solicitud2 {
  createdAt: Date,
  titulo_solicitud: string,
  asunto_solicitud: string,
  descripcion: string,
  estado_solicitud: string,
  respuesta: string,
  fk_id_vecino: number
};

export interface Solicitud3 {
  id_solicitud: number,
  titulo_solicitud: string,
  asunto_solicitud: string,
  descripcion: string,
  estado_solicitud: string,
  createdAt: Date,
  primer_nombre: string,
  primer_apellido: string,
  respuesta: string,
  fk_id_vecino: number,
  fk_id_junta_vecinal: number
};

export interface Solicitud4 {
  id_solicitud: number,
  estado_solicitud: string,
  respuesta: string
};
