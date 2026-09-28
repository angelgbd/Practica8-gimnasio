import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import type {
  EstadoInscripcion,
  Horario,
  Inscripcion,
  Miembro,
  NuevaInscripcion,
} from "../dominio/entidades";
import type { InscripcionRepository } from "../dominio/inscripcion.repository";

type InscripcionRow = {
  id: number;
  horarioId: number;
  miembroId: number;
  estado: string;
  creadoEn: Date;
};

@Injectable()
export class InscripcionPrismaRepository implements InscripcionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async listar(): Promise<Inscripcion[]> {
    const inscripciones = await this.prisma.inscripcion.findMany({
      orderBy: { id: "asc" },
    });
    return inscripciones.map((inscripcion) => this.aDominio(inscripcion));
  }

  async buscarPorId(id: number): Promise<Inscripcion | null> {
    const inscripcion = await this.prisma.inscripcion.findUnique({
      where: { id },
    });
    return inscripcion ? this.aDominio(inscripcion) : null;
  }

  async buscarPorHorario(horarioId: number): Promise<Inscripcion[]> {
    const inscripciones = await this.prisma.inscripcion.findMany({
      where: { horarioId },
      orderBy: { id: "asc" },
    });
    return inscripciones.map((inscripcion) => this.aDominio(inscripcion));
  }

  async buscarHorario(horarioId: number): Promise<Horario | null> {
    const horario = await this.prisma.horario.findUnique({
      where: { id: horarioId },
    });
    if (!horario) return null;

    return {
      id: horario.id,
      claseId: horario.claseId,
      dia: horario.dia,
      horaInicio: horario.horaInicio,
      cupoMaximo: horario.cupoMaximo,
      entrenador: horario.entrenador,
    };
  }

  async buscarMiembro(miembroId: number): Promise<Miembro | null> {
    const miembro = await this.prisma.miembro.findUnique({
      where: { id: miembroId },
    });
    if (!miembro) return null;

    return {
      id: miembro.id,
      nombre: miembro.nombre,
      correo: miembro.correo,
      membresia: miembro.membresia,
      activo: miembro.activo,
    };
  }

  async guardar(datos: NuevaInscripcion): Promise<Inscripcion> {
    const inscripcion = await this.prisma.inscripcion.create({ data: datos });
    return this.aDominio(inscripcion);
  }

  async cancelar(id: number): Promise<Inscripcion | null> {
    const existente = await this.prisma.inscripcion.findUnique({
      where: { id },
    });
    if (!existente) return null;

    const inscripcion = await this.prisma.inscripcion.update({
      where: { id },
      data: { estado: "cancelada" },
    });
    return this.aDominio(inscripcion);
  }

  private aDominio(inscripcion: InscripcionRow): Inscripcion {
    return {
      id: inscripcion.id,
      horarioId: inscripcion.horarioId,
      miembroId: inscripcion.miembroId,
      estado: inscripcion.estado as EstadoInscripcion,
      creadaEn: inscripcion.creadoEn,
    };
  }
}
