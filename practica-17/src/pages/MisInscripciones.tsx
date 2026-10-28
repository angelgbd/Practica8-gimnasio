import { useEffect, useState } from "react";
import { Link } from "react-router";
import { obtenerOfertaClases, type OfertaClases } from "../lib/horarios";
import { obtenerMisInscripciones } from "../lib/inscripciones";
import type { Inscripcion } from "../types";
import { diaLegible } from "../utils/diaLegible";
import { mensajeDeError } from "../utils/mensajeDeError";

function mostrarFecha(valor: string): string {
  const fecha = new Date(valor);
  if (Number.isNaN(fecha.getTime())) return "Fecha no disponible";
  return new Intl.DateTimeFormat("es-MX", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(fecha);
}

export function MisInscripciones() {
  const [inscripciones, setInscripciones] = useState<Inscripcion[]>([]);
  const [oferta, setOferta] = useState<OfertaClases | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let activa = true;
    Promise.all([obtenerMisInscripciones(), obtenerOfertaClases()])
      .then(([lista, clases]) => {
        if (!activa) return;
        setInscripciones(lista);
        setOferta(clases);
      })
      .catch((fallo: unknown) => {
        if (activa) {
          setError(
            mensajeDeError(
              fallo,
              "No se pudieron cargar tus inscripciones. Inténtalo de nuevo.",
            ),
          );
        }
      })
      .finally(() => {
        if (activa) setCargando(false);
      });

    return () => {
      activa = false;
    };
  }, []);

  return (
    <main className="page-content enrollment-page">
      <section className="classes-intro" aria-labelledby="enrollment-title">
        <div>
          <h1 id="enrollment-title">Mis inscripciones.</h1>
          <p>Consulta tus lugares reservados y el horario de cada clase.</p>
        </div>
      </section>

      {error && (
        <div className="form-message form-message--error page-message" role="alert">
          {error}
        </div>
      )}

      {cargando ? (
        <p className="page-loading" role="status">Cargando tus inscripciones…</p>
      ) : inscripciones.length === 0 && !error ? (
        <section className="empty-state">
          <h2>Aún no tienes inscripciones.</h2>
          <p>Elige un horario y reserva tu primer lugar.</p>
          <Link className="button button--dark" to="/">
            Ver horarios
          </Link>
        </section>
      ) : (
        <section className="enrollment-list" aria-label="Tus inscripciones">
          {inscripciones.map((inscripcion) => {
            const horario = oferta?.horarios.find(
              (item) => item.id === inscripcion.horarioId,
            );
            const clase = horario
              ? oferta?.clases.find((item) => item.id === horario.claseId)
              : undefined;

            return (
              <article className="enrollment-row" key={inscripcion.id}>
                <div className="enrollment-row__main">
                  <h2>{clase?.nombre ?? `Horario ${inscripcion.horarioId}`}</h2>
                  {horario ? (
                    <p>
                      {diaLegible(horario.dia)} · {horario.horaInicio} · {horario.entrenador}
                    </p>
                  ) : (
                    <p>Los detalles de este horario ya no están disponibles.</p>
                  )}
                </div>
                <div className="enrollment-row__meta">
                  <span
                    className={`enrollment-state enrollment-state--${inscripcion.estado}`}
                  >
                    {inscripcion.estado === "confirmada" ? "Confirmada" : "Cancelada"}
                  </span>
                  <span>Registrada {mostrarFecha(inscripcion.creadaEn)}</span>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
}
