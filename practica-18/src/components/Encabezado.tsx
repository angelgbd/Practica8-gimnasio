import { Link } from "react-router";
import { useSesion } from "../context/SesionContext";
import { useInscripcionesStore } from "../stores/inscripcionesStore";

export function Encabezado() {
  const { usuario, salir } = useSesion();
  const inscripciones = useInscripcionesStore((estado) => estado.inscripciones);
  const cargandoInscripciones = useInscripcionesStore(
    (estado) => estado.cargando,
  );
  const confirmadas = inscripciones.filter(
    (inscripcion) => inscripcion.estado === "confirmada",
  ).length;

  function cerrarSesion() {
    salir();
  }

  return (
    <header className="site-header">
      <Link className="wordmark" to="/" aria-label="Gimnasio, inicio">
        <span className="wordmark__symbol" aria-hidden="true">G</span>
        <span>GIMNASIO</span>
      </Link>

      <nav className="site-header__actions" aria-label="Navegación principal">
        <Link className="text-link" to="/">
          Horarios
        </Link>
        {usuario ? (
          <>
            <Link className="text-link header-enrollments" to="/mis-inscripciones">
              Mis inscripciones
              <span
                className="enrollment-count"
                aria-label={
                  cargandoInscripciones
                    ? "Cargando inscripciones"
                    : `${confirmadas} ${confirmadas === 1 ? "inscripción" : "inscripciones"}`
                }
              >
                {cargandoInscripciones ? "…" : confirmadas}
              </span>
            </Link>
            <span className="account-email" title={usuario.correo}>
              <span className="account-email__dot" aria-hidden="true" />
              {usuario.correo}
            </span>
            <button
              className="button button--quiet button--small"
              onClick={cerrarSesion}
              type="button"
            >
              Salir
            </button>
          </>
        ) : (
          <>
            <Link className="button button--dark button--small" to="/entrar">
              Entrar
            </Link>
            <Link className="text-link" to="/registro">
              Crear cuenta
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
