import { Link, useNavigate } from "react-router";
import { useSesion } from "../context/SesionContext";

export function Encabezado() {
  const { usuario, salir } = useSesion();
  const navigate = useNavigate();

  function cerrarSesion() {
    salir();
    navigate("/", { replace: true, state: null });
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
            <Link className="text-link" to="/mis-inscripciones">
              Mis inscripciones
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
