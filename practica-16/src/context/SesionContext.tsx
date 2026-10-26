import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import { api, CLAVE_SESION } from "../lib/api";
import type {
  Credenciales,
  RespuestaToken,
  Sesion,
  Sobre,
  UsuarioSesion,
} from "../types";

interface SesionContexto {
  sesion: Sesion | null;
  token: string | null;
  usuario: UsuarioSesion | null;
  entrar: (credenciales: Credenciales) => Promise<void>;
  registrar: (credenciales: Credenciales) => Promise<void>;
  salir: () => void;
}

const ContextoSesion = createContext<SesionContexto | undefined>(undefined);

function leerSesionGuardada(): Sesion | null {
  try {
    const contenido = localStorage.getItem(CLAVE_SESION);
    if (!contenido) return null;

    const valor = JSON.parse(contenido) as Partial<Sesion>;
    if (
      typeof valor.token === "string" &&
      valor.usuario &&
      typeof valor.usuario.correo === "string"
    ) {
      return valor as Sesion;
    }

    localStorage.removeItem(CLAVE_SESION);
  } catch {
    localStorage.removeItem(CLAVE_SESION);
  }

  return null;
}

export function SesionProvider({ children }: PropsWithChildren) {
  const [sesion, setSesion] = useState<Sesion | null>(leerSesionGuardada);

  const autenticar = useCallback(async (
    endpoint: "/auth/login" | "/auth/registro",
    credenciales: Credenciales,
  ) => {
    const respuesta = await api.post<Sobre<RespuestaToken>>(
      endpoint,
      credenciales,
    );
    const token = respuesta.data.data.access_token;

    // El interceptor usa este token en /auth/yo; se completa el usuario después.
    localStorage.setItem(
      CLAVE_SESION,
      JSON.stringify({ token, usuario: null }),
    );

    try {
      const perfil = await api.get<Sobre<UsuarioSesion>>("/auth/yo");
      const nuevaSesion: Sesion = { token, usuario: perfil.data.data };
      localStorage.setItem(CLAVE_SESION, JSON.stringify(nuevaSesion));
      setSesion(nuevaSesion);
    } catch (error) {
      localStorage.removeItem(CLAVE_SESION);
      setSesion(null);
      throw error;
    }
  }, []);

  const entrar = useCallback(
    (credenciales: Credenciales) => autenticar("/auth/login", credenciales),
    [autenticar],
  );

  const registrar = useCallback(
    (credenciales: Credenciales) =>
      autenticar("/auth/registro", credenciales),
    [autenticar],
  );

  const salir = useCallback(() => {
    localStorage.removeItem(CLAVE_SESION);
    setSesion(null);
  }, []);

  const valor = useMemo<SesionContexto>(
    () => ({
      sesion,
      token: sesion?.token ?? null,
      usuario: sesion?.usuario ?? null,
      entrar,
      registrar,
      salir,
    }),
    [sesion, entrar, registrar, salir],
  );

  return <ContextoSesion value={valor}>{children}</ContextoSesion>;
}

export function useSesion(): SesionContexto {
  const contexto = useContext(ContextoSesion);
  if (!contexto) {
    throw new Error("useSesion debe usarse dentro de <SesionProvider>.");
  }
  return contexto;
}
