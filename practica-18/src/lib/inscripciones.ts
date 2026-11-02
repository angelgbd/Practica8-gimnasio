import { api } from "./api";
import type { Inscripcion, Sobre } from "../types";

export async function obtenerMisInscripciones(): Promise<Inscripcion[]> {
  const respuesta = await api.get<Sobre<Inscripcion[]>>("/inscripciones/mias");
  return respuesta.data.data;
}

export async function inscribirse(horarioId: number): Promise<Inscripcion> {
  const respuesta = await api.post<Sobre<Inscripcion>>("/inscripciones", {
    horarioId,
  });
  return respuesta.data.data;
}
