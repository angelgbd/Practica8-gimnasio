import { create } from "zustand";
import { obtenerMisInscripciones } from "../lib/inscripciones";
import type { Inscripcion } from "../types";
import { mensajeDeError } from "../utils/mensajeDeError";

interface EstadoInscripciones {
  inscripciones: Inscripcion[];
  cargando: boolean;
  error: string;
  cargarInscripciones: () => Promise<void>;
  agregarInscripcion: (inscripcion: Inscripcion) => void;
  vaciarInscripciones: () => void;
}

let identificadorDeCarga = 0;

export const useInscripcionesStore = create<EstadoInscripciones>((set) => ({
  inscripciones: [],
  cargando: false,
  error: "",

  cargarInscripciones: async () => {
    const identificadorActual = ++identificadorDeCarga;
    set({ cargando: true, error: "" });

    try {
      const inscripciones = await obtenerMisInscripciones();
      if (identificadorActual === identificadorDeCarga) {
        set({ inscripciones, cargando: false, error: "" });
      }
    } catch (fallo) {
      if (identificadorActual === identificadorDeCarga) {
        set({
          inscripciones: [],
          cargando: false,
          error: mensajeDeError(
            fallo,
            "No se pudieron cargar tus inscripciones.",
          ),
        });
      }
    }
  },

  agregarInscripcion: (inscripcion) =>
    set((estado) => ({
      inscripciones: [
        ...estado.inscripciones.filter((actual) => actual.id !== inscripcion.id),
        inscripcion,
      ],
      error: "",
    })),

  vaciarInscripciones: () => {
    identificadorDeCarga += 1;
    set({ inscripciones: [], cargando: false, error: "" });
  },
}));
