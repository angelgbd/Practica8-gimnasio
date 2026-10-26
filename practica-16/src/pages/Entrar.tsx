import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { useSesion } from "../context/SesionContext";
import { mensajeDeError } from "../utils/mensajeDeError";

export function Entrar() {
  const { entrar } = useSesion();
  const navigate = useNavigate();
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setMensaje("");
    setEnviando(true);

    try {
      await entrar({ correo, password });
      navigate("/", { replace: true });
    } catch (error) {
      setMensaje(
        mensajeDeError(
          error,
          "No se pudo iniciar sesión. Revisa tus datos e inténtalo de nuevo.",
        ),
      );
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main className="page-content auth-page">
      <section className="auth-intro" aria-labelledby="auth-intro-title">
        <h1 id="auth-intro-title">Vuelve a tu ritmo.</h1>
        <p>
          Entra con el correo de tu cuenta y continúa desde donde lo dejaste.
        </p>
      </section>

      <section className="form-panel" aria-labelledby="form-title">
        <div className="form-panel__heading">
          <h2 id="form-title">Entrar</h2>
          <p>Usa tus credenciales del gimnasio.</p>
        </div>

        <form className="auth-form" onSubmit={enviar}>
          <label className="field">
            <span>Correo electrónico</span>
            <input
              autoComplete="email"
              autoCapitalize="none"
              name="correo"
              onChange={(evento) => setCorreo(evento.target.value)}
              required
              spellCheck={false}
              type="email"
              value={correo}
            />
          </label>

          <label className="field">
            <span>Contraseña</span>
            <input
              autoComplete="current-password"
              name="password"
              onChange={(evento) => setPassword(evento.target.value)}
              required
              type="password"
              value={password}
            />
          </label>

          {mensaje && (
            <p className="form-message form-message--error" role="alert">
              {mensaje}
            </p>
          )}

          <button
            className="button button--accent form-submit"
            disabled={enviando}
            type="submit"
          >
            {enviando ? "Entrando…" : "Entrar"}
          </button>
        </form>

        <p className="form-switch">
          ¿Aún no tienes cuenta? <Link to="/registro">Regístrate</Link>
        </p>
      </section>
    </main>
  );
}
