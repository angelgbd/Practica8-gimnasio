import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { map, Observable } from "rxjs";

export interface Sobre<T> {
  data: T;
  meta: {
    ruta: string;
    duracionMs: number;
    timestamp: string;
  };
}

@Injectable()
export class SobreInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Sobre<unknown>> {
    const request = context.switchToHttp().getRequest<{ url: string }>();
    const startedAt = Date.now();

    return next.handle().pipe(
      map(
        (data: unknown): Sobre<unknown> => ({
          data,
          meta: {
            ruta: request.url,
            duracionMs: Date.now() - startedAt,
            timestamp: new Date().toISOString(),
          },
        }),
      ),
    );
  }
}
