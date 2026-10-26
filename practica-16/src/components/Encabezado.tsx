import { Link, useNavigate } from "react-router";
import { useSesion } from "../context/SesionContext";

export function Encabezado() {
  const { usuario, salir } = useSesion();
  const navigate = useNavigate();

  function cerrarSesion() {
    salir();
    navigate("/entrar");
  }

  return (
    <header className="site-header">
      <Link className="wordmark" to="/" aria-label="Gimnasio, inicio">
        <span className="wordmark__symbol" aria-hidden="true">G</span>
        <span>GIMNASIO</span>
      </Link>

      <nav className="site-header__actions" aria-label="Navegación principal">
        {usuario ? (
          <>
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
            <Link className="text-link" to="/registro">
              Crear cuenta
            </Link>
            <Link className="button button--dark button--small" to="/entrar">
              Entrar
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
