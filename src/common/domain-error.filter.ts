import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import type { Request, Response } from "express";
import {
  CupoLlenoError,
  DomainError,
  HorarioNoEncontradoError,
  InscripcionDuplicadaError,
  MiembroNoEncontradoError,
} from "../inscripciones/dominio/errores";

@Catch(DomainError)
export class DomainErrorFilter implements ExceptionFilter<DomainError> {
  private readonly logger = new Logger("Dominio");

  private codigoPara(exception: DomainError): number {
    if (
      exception instanceof HorarioNoEncontradoError ||
      exception instanceof MiembroNoEncontradoError
    ) {
      return HttpStatus.NOT_FOUND;
    }

    if (
      exception instanceof CupoLlenoError ||
      exception instanceof InscripcionDuplicadaError
    ) {
      return HttpStatus.CONFLICT;
    }

    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  catch(exception: DomainError, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();
    const statusCode = this.codigoPara(exception);

    this.logger.warn(
      `${request.method} ${request.url} -> ${statusCode} ${exception.constructor.name}`,
    );

    response.status(statusCode).json({
      statusCode,
      error: exception.constructor.name,
      message: exception.message,
      path: request.originalUrl,
      timestamp: new Date().toISOString(),
    });
  }
}
