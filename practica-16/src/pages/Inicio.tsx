import { Link } from "react-router";
import { useSesion } from "../context/SesionContext";

const nombresRol = {
  miembro: "Miembro",
  entrenador: "Entrenador",
  admin: "Administración",
} as const;

export function Inicio() {
  const { usuario } = useSesion();

  return (
    <main className="page-content landing-page">
      <section className="landing-copy" aria-labelledby="landing-title">
        {usuario ? (
          <>
            <p className="status-line">
              <span className="status-line__dot" aria-hidden="true" />
              Sesión activa
            </p>
            <h1 id="landing-title">Hola, {usuario.correo}.</h1>
            <p className="landing-copy__body">
              Tu sesión está lista. Las solicitudes protegidas se envían con tu
              token de acceso.
            </p>
            <p className="role-tag">{nombresRol[usuario.rol]}</p>
          </>
        ) : (
          <>
            <h1 id="landing-title">Tu cuenta del gimnasio, lista para entrar.</h1>
            <p className="landing-copy__body">
              Inicia sesión con tu correo o crea una cuenta para continuar.
            </p>
            <div className="landing-actions">
              <Link className="button button--dark" to="/entrar">
                Entrar a mi cuenta
              </Link>
              <Link className="text-link" to="/registro">
                Crear cuenta
              </Link>
            </div>
          </>
        )}
      </section>

      <aside className="landing-note" aria-label="Información de acceso">
        <span className="landing-note__mark" aria-hidden="true">G</span>
        <p>Acceso de miembros y personal</p>
        <span className="landing-note__rule" aria-hidden="true" />
        <p className="landing-note__detail">
          Una sola sesión para iniciar y continuar desde este navegador.
        </p>
      </aside>
    </main>
  );
}
