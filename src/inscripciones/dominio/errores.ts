export type DomainErrorKind = "not_found" | "conflict";

export abstract class DomainError extends Error {
  protected constructor(
    message: string,
    readonly kind: DomainErrorKind,
  ) {
    super(message);
    this.name = new.target.name;
  }
}

export class HorarioNoEncontradoError extends DomainError {
  constructor(horarioId: number) {
    super(`No existe el horario ${horarioId}`, "not_found");
  }
}

export class MiembroNoEncontradoError extends DomainError {
  constructor(miembroId: number) {
    super(`No existe el miembro ${miembroId}`, "not_found");
  }
}

export class CupoLlenoError extends DomainError {
  constructor(horarioId: number, cupoMaximo: number) {
    super(
      `El horario ${horarioId} ya tiene ${cupoMaximo} inscripciones confirmadas`,
      "conflict",
    );
  }
}

export class InscripcionDuplicadaError extends DomainError {
  constructor(horarioId: number, miembroId: number) {
    super(
      `El miembro ${miembroId} ya esta inscrito en el horario ${horarioId}`,
      "conflict",
    );
  }
}
