import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { useSesion } from "../context/SesionContext";
import { mensajeDeError } from "../utils/mensajeDeError";

export function Registro() {
  const { registrar } = useSesion();
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
      await registrar({ correo, password });
      navigate("/", { replace: true });
    } catch (error) {
      setMensaje(
        mensajeDeError(
          error,
          "No se pudo crear la cuenta. Revisa tus datos e inténtalo de nuevo.",
        ),
      );
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main className="page-content auth-page">
      <section className="auth-intro" aria-labelledby="auth-intro-title">
        <h1 id="auth-intro-title">Empieza con tu cuenta.</h1>
        <p>
          Regístrate con tu correo y crea una contraseña para iniciar sesión.
        </p>
      </section>

      <section className="form-panel" aria-labelledby="form-title">
        <div className="form-panel__heading">
          <h2 id="form-title">Crear cuenta</h2>
          <p>Solo necesitamos tu correo y una contraseña.</p>
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
              autoComplete="new-password"
              minLength={8}
              name="password"
              onChange={(evento) => setPassword(evento.target.value)}
              required
              type="password"
              value={password}
            />
            <span className="field-hint">Al menos 8 caracteres.</span>
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
            {enviando ? "Creando cuenta…" : "Crear cuenta"}
          </button>
        </form>

        <p className="form-switch">
          ¿Ya tienes cuenta? <Link to="/entrar">Entra aquí</Link>
        </p>
      </section>
    </main>
  );
}
