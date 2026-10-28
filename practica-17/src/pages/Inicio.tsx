import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useSesion } from "../context/SesionContext";
import { obtenerHorario, obtenerOfertaClases } from "../lib/horarios";
import { inscribirse } from "../lib/inscripciones";
import type { OfertaClases } from "../lib/horarios";
import { diaLegible } from "../utils/diaLegible";
import { mensajeDeError } from "../utils/mensajeDeError";

interface AvisoInscripcion {
  tipo: "exito" | "error";
  mensaje: string;
}

export function Inicio() {
  const { usuario } = useSesion();
  const navigate = useNavigate();
  const location = useLocation();
  const [oferta, setOferta] = useState<OfertaClases | null>(null);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState("");
  const [inscribiendo, setInscribiendo] = useState<number | null>(null);
  const [avisos, setAvisos] = useState<Record<number, AvisoInscripcion>>({});

  useEffect(() => {
    let activa = true;
    obtenerOfertaClases()
      .then((resultado) => {
        if (activa) setOferta(resultado);
      })
      .catch((error: unknown) => {
        if (activa) {
          setErrorCarga(
            mensajeDeError(error, "No se pudieron cargar los horarios."),
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

  async function solicitarInscripcion(horarioId: number) {
    if (!usuario) {
      navigate("/entrar", {
        state: {
          from: {
            pathname: location.pathname,
            search: location.search,
            hash: location.hash,
          },
        },
      });
      return;
    }

    setInscribiendo(horarioId);
    setAvisos((actuales) => {
      const siguientes = { ...actuales };
      delete siguientes[horarioId];
      return siguientes;
    });

    try {
      await inscribirse(horarioId);
      setAvisos((actuales) => ({
        ...actuales,
        [horarioId]: {
          tipo: "exito",
          mensaje: "Inscripción confirmada. Actualizando los lugares disponibles…",
        },
      }));

      try {
        const horarioActualizado = await obtenerHorario(horarioId);
        setOferta((actual) =>
          actual
            ? {
                ...actual,
                horarios: actual.horarios.map((horario) =>
                  horario.id === horarioId ? horarioActualizado : horario,
                ),
              }
            : actual,
        );
        setAvisos((actuales) => ({
          ...actuales,
          [horarioId]: {
            tipo: "exito",
            mensaje: "Inscripción confirmada y lugares disponibles actualizados.",
          },
        }));
      } catch {
        setAvisos((actuales) => ({
          ...actuales,
          [horarioId]: {
            tipo: "exito",
            mensaje:
              "La inscripción quedó confirmada. Actualiza la página para volver a consultar los lugares.",
          },
        }));
      }
    } catch (error) {
      setAvisos((actuales) => ({
        ...actuales,
        [horarioId]: {
          tipo: "error",
          mensaje: mensajeDeError(
            error,
            "No se pudo completar la inscripción. Inténtalo de nuevo.",
          ),
        },
      }));
    } finally {
      setInscribiendo(null);
    }
  }

  return (
    <main className="page-content classes-page">
      <section className="classes-intro" aria-labelledby="classes-title">
        <div>
          <h1 id="classes-title">Encuentra tu próxima clase.</h1>
          <p>
            Revisa el horario y el cupo antes de reservar tu lugar.
          </p>
        </div>
        {oferta && (
          <p className="classes-count">
            {oferta.horarios.length} {oferta.horarios.length === 1 ? "horario" : "horarios"}
          </p>
        )}
      </section>

      {errorCarga && (
        <div className="form-message form-message--error page-message" role="alert">
          {errorCarga}
        </div>
      )}

      {cargando ? (
        <p className="page-loading" role="status">Cargando horarios…</p>
      ) : oferta && oferta.horarios.length > 0 ? (
        <section className="schedule-list" aria-label="Horarios disponibles">
          {oferta.horarios.map((horario) => {
            const clase = oferta.clases.find((item) => item.id === horario.claseId);
            const aviso = avisos[horario.id];
            const sinLugares = horario.lugaresDisponibles <= 0;

            return (
              <article className="schedule-row" key={horario.id}>
                <div className="schedule-row__class">
                  <h2>{clase?.nombre ?? `Clase ${horario.claseId}`}</h2>
                  <p>{clase?.descripcion || "Sesión guiada por el entrenador."}</p>
                </div>

                <dl className="schedule-row__details">
                  <div>
                    <dt>Horario</dt>
                    <dd>{diaLegible(horario.dia)} · {horario.horaInicio}</dd>
                  </div>
                  <div>
                    <dt>Entrenador</dt>
                    <dd>{horario.entrenador}</dd>
                  </div>
                  <div>
                    <dt>Cupo</dt>
                    <dd>
                      {sinLugares
                        ? "Sin lugares disponibles"
                        : `${horario.lugaresDisponibles} ${horario.lugaresDisponibles === 1 ? "lugar" : "lugares"} disponibles`}
                    </dd>
                  </div>
                </dl>

                <button
                  className="button button--dark schedule-row__action"
                  disabled={sinLugares || inscribiendo === horario.id}
                  onClick={() => void solicitarInscripcion(horario.id)}
                  type="button"
                >
                  {inscribiendo === horario.id
                    ? "Inscribiendo…"
                    : sinLugares
                      ? "Cupo lleno"
                      : "Inscribirme"}
                </button>

                {aviso && (
                  <p
                    className={`form-message page-message page-message--${aviso.tipo}`}
                    role={aviso.tipo === "error" ? "alert" : "status"}
                  >
                    {aviso.mensaje}
                  </p>
                )}
              </article>
            );
          })}
        </section>
      ) : !errorCarga ? (
        <section className="empty-state">
          <h2>Aún no hay horarios publicados.</h2>
          <p>Cuando el gimnasio publique nuevas clases, aparecerán aquí.</p>
        </section>
      ) : null}
    </main>
  );
}
