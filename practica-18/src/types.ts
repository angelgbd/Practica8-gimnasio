export type Rol = "miembro" | "entrenador" | "admin";

export interface UsuarioSesion {
  sub: number;
  correo: string;
  rol: Rol;
  miembroId: number | null;
}

export interface Sesion {
  token: string;
  usuario: UsuarioSesion;
}

export interface Credenciales {
  correo: string;
  password: string;
}

export interface RespuestaToken {
  access_token: string;
  token_type: "Bearer";
  expires_in: number;
}

export interface Sobre<T> {
  data: T;
  meta?: {
    ruta: string;
    duracionMs: number;
    timestamp: string;
  };
}

export interface Clase {
  id: number;
  nombre: string;
  descripcion: string;
}

export interface Horario {
  id: number;
  claseId: number;
  dia: string;
  horaInicio: string;
  cupoMaximo: number;
  lugaresDisponibles: number;
  entrenador: string;
}

export interface Inscripcion {
  id: number;
  horarioId: number;
  miembroId: number;
  estado: "confirmada" | "cancelada";
  creadaEn: string;
}
