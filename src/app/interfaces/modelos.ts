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
  segundo_nombre: string,
  primer_apellido: string,
  segundo_apellido: string,
  direccion_rep: string,
  numero_rep: number,
  correo_electronico: string,
  telefono: number;
  contrasenia: string,
  comuna_rep: number,
  avatar:string,
  ruta_evidencia: string,
  ruta_firma: string,
  id_junta_vecinal: number
};

export interface Vecino {
  rut_vecino: string,
  primer_nombre: string,
  segundo_nombre: string,
  primer_apellido: string,
  segundo_apellido: string,
  direccion: string,
  correo_electronico: string,
  telefono: number;
  contrasenia: string,
  avatar:string,
  ruta_evidencia: string,
  estado: number,
  fk_id_junta_vecinal: number,
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
  id: string,
  name: string,
  apellido: string,
  rut: string,
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

export interface Valoracion {
  opinion: string,
  estrellas: number,
  id_v:number
}
export interface Vecino4 {
  rut_vecino: string,
  primer_nombre: string,
  segundo_nombre: string,
  primer_apellido: string,
  segundo_apellido: string,
  direccion: string,
  correo_electronico: string,
  telefono: number;
  contrasenia: string,
  avatar: string,
  ruta_evidencia: string,
  estado: number,
  fk_id_junta_vecinal: number,
  imageUrl?: string, // Nueva propiedad imageUrl de tipo string opcional
}

export interface listValor {
  vecino: string,
  estrellas: number,
  comentario: string
}


export interface reportes {
  id_junta_vecinal : number,
  rut_junta : string,
  razon_social : string,
  rut_vecino : string,
  primer_nombre : string,
  segundo_nombre : string,
  primer_apellido : string,
  segundo_apellido : string,
  direccion : string,
  nombre : string,
  descripcion : string,
  estado : string,
  fecha_proyecto : string,
  cupo_min : number,
  cupo_max : number,
}

