import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import type { PayloadJwt, Rol } from "../dominio/usuario";
import { ROLES_REQUERIDOS } from "../decoradores/roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<Rol[]>(ROLES_REQUERIDOS, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!roles?.length) return true;

    const request = context.switchToHttp().getRequest<{ user?: PayloadJwt }>();
    return request.user !== undefined && roles.includes(request.user.rol);
  }
}
