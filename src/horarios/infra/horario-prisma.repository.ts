import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import type { Horario } from "../dominio/entidades";
import type { HorarioRepository } from "../dominio/horario.repository";
import type { CrearHorarioDto } from "../dto/crear-horario.dto";
import type { ActualizarHorarioDto } from "../dto/actualizar-horario.dto";

@Injectable()
export class HorarioPrismaRepository implements HorarioRepository {
  constructor(private readonly prisma: PrismaService) {}

  async listar(): Promise<Horario[]> {
    const horarios = await this.prisma.horario.findMany({
      orderBy: { id: "asc" },
    });
    return horarios.map((horario) => this.aDominio(horario));
  }

  async buscarPorId(id: number): Promise<Horario | null> {
    const horario = await this.prisma.horario.findUnique({ where: { id } });
    return horario ? this.aDominio(horario) : null;
  }

  async crear(datos: CrearHorarioDto): Promise<Horario> {
    const horario = await this.prisma.horario.create({ data: datos });
    return this.aDominio(horario);
  }

  async actualizar(
    id: number,
    datos: ActualizarHorarioDto,
  ): Promise<Horario | null> {
    const existente = await this.prisma.horario.findUnique({ where: { id } });
    if (!existente) return null;

    const horario = await this.prisma.horario.update({
      where: { id },
      data: datos,
    });
    return this.aDominio(horario);
  }

  async eliminar(id: number): Promise<Horario | null> {
    const existente = await this.prisma.horario.findUnique({ where: { id } });
    if (!existente) return null;

    const horario = await this.prisma.horario.delete({ where: { id } });
    return this.aDominio(horario);
  }

  private aDominio(horario: {
    id: number;
    claseId: number;
    dia: string;
    horaInicio: string;
    cupoMaximo: number;
    entrenador: string;
  }): Horario {
    return {
      id: horario.id,
      claseId: horario.claseId,
      dia: horario.dia,
      horaInicio: horario.horaInicio,
      cupoMaximo: horario.cupoMaximo,
      entrenador: horario.entrenador,
    };
  }
}
