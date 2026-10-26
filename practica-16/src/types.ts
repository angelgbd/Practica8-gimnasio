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
