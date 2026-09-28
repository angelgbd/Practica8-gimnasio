import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import type { Miembro } from "../dominio/entidades";
import type { MiembroRepository } from "../dominio/miembro.repository";
import type { CrearMiembroDto } from "../dto/crear-miembro.dto";
import type { ActualizarMiembroDto } from "../dto/actualizar-miembro.dto";

@Injectable()
export class MiembroPrismaRepository implements MiembroRepository {
  constructor(private readonly prisma: PrismaService) {}

  async listar(): Promise<Miembro[]> {
    const miembros = await this.prisma.miembro.findMany({
      orderBy: { id: "asc" },
    });
    return miembros.map((miembro) => this.aDominio(miembro));
  }

  async buscarPorId(id: number): Promise<Miembro | null> {
    const miembro = await this.prisma.miembro.findUnique({ where: { id } });
    return miembro ? this.aDominio(miembro) : null;
  }

  async crear(datos: CrearMiembroDto): Promise<Miembro> {
    const miembro = await this.prisma.miembro.create({ data: datos });
    return this.aDominio(miembro);
  }

  async actualizar(
    id: number,
    datos: ActualizarMiembroDto,
  ): Promise<Miembro | null> {
    const existente = await this.prisma.miembro.findUnique({ where: { id } });
    if (!existente) return null;

    const miembro = await this.prisma.miembro.update({
      where: { id },
      data: datos,
    });
    return this.aDominio(miembro);
  }

  async eliminar(id: number): Promise<Miembro | null> {
    const existente = await this.prisma.miembro.findUnique({ where: { id } });
    if (!existente) return null;

    const miembro = await this.prisma.miembro.delete({ where: { id } });
    return this.aDominio(miembro);
  }

  private aDominio(miembro: {
    id: number;
    nombre: string;
    correo: string;
    membresia: string;
    activo: boolean;
  }): Miembro {
    return {
      id: miembro.id,
      nombre: miembro.nombre,
      correo: miembro.correo,
      membresia: miembro.membresia,
      activo: miembro.activo,
    };
  }
}
