import axios from "axios";
import type { Sesion } from "../types";

export const CLAVE_SESION = "gimnasio.sesion";

function leerTokenGuardado(): string | null {
  try {
    const contenido = localStorage.getItem(CLAVE_SESION);
    if (!contenido) return null;

    const sesion = JSON.parse(contenido) as Partial<Sesion>;
    return typeof sesion.token === "string" ? sesion.token : null;
  } catch {
    return null;
  }
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
});

let manejarSesionExpirada: (() => void) | undefined;

export function registrarManejador401(manejador: () => void): () => void {
  manejarSesionExpirada = manejador;
  return () => {
    if (manejarSesionExpirada === manejador) manejarSesionExpirada = undefined;
  };
}

api.interceptors.request.use((config) => {
  const token = leerTokenGuardado();
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

api.interceptors.response.use(
  (respuesta) => respuesta,
  (error: unknown) => {
    if (
      axios.isAxiosError(error) &&
      error.response?.status === 401 &&
      leerTokenGuardado()
    ) {
      localStorage.removeItem(CLAVE_SESION);
      manejarSesionExpirada?.();
    }
    return Promise.reject(error);
  },
);
