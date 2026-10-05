import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import type { PayloadJwt } from "../dominio/usuario";

export const UsuarioActual = createParamDecorator(
  (_dato: unknown, contexto: ExecutionContext): PayloadJwt => {
    const request = contexto
      .switchToHttp()
      .getRequest<{ user: PayloadJwt }>();
    return request.user;
  },
);
