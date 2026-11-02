import { api } from "./api";
import type { Clase, Horario, Sobre } from "../types";

export interface OfertaClases {
  clases: Clase[];
  horarios: Horario[];
}

export async function obtenerOfertaClases(): Promise<OfertaClases> {
  const [respuestaClases, respuestaHorarios] = await Promise.all([
    api.get<Sobre<Clase[]>>("/clases"),
    api.get<Sobre<Horario[]>>("/horarios"),
  ]);

  return {
    clases: respuestaClases.data.data,
    horarios: respuestaHorarios.data.data,
  };
}

export async function obtenerHorario(id: number): Promise<Horario> {
  const respuesta = await api.get<Sobre<Horario>>(`/horarios/${id}`);
  return respuesta.data.data;
}
