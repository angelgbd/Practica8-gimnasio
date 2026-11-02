import axios from "axios";

export function mensajeDeError(error: unknown, alternativa: string): string {
  if (!axios.isAxiosError(error)) return alternativa;

  const cuerpo = error.response?.data as { message?: unknown } | undefined;
  if (Array.isArray(cuerpo?.message)) {
    const mensajes = cuerpo.message.filter(
      (valor): valor is string => typeof valor === "string",
    );
    if (mensajes.length) return mensajes.join(". ");
  }
  if (typeof cuerpo?.message === "string") return cuerpo.message;
  if (!error.response) {
    return "No se pudo conectar con la API. Verifica que esté funcionando y vuelve a intentarlo.";
  }
  return alternativa;
}
