import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import type { Request, Response } from "express";
import { DomainError } from "../inscripciones/dominio/errores";

@Catch(DomainError)
export class DomainErrorFilter implements ExceptionFilter<DomainError> {
  catch(exception: DomainError, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();
    const statusCode = exception.kind === "not_found" ? 404 : 409;

    response.status(statusCode).json({
      statusCode,
      message: exception.message,
      path: request.originalUrl,
      timestamp: new Date().toISOString(),
    });
  }
}
