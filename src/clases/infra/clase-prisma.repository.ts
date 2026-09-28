import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import type { Clase } from "../dominio/entidades";
import type { ClaseRepository } from "../dominio/clase.repository";
import type { CrearClaseDto } from "../dto/crear-clase.dto";
import type { ActualizarClaseDto } from "../dto/actualizar-clase.dto";

@Injectable()
export class ClasePrismaRepository implements ClaseRepository {
  constructor(private readonly prisma: PrismaService) {}

  async listar(): Promise<Clase[]> {
    const clases = await this.prisma.clase.findMany({ orderBy: { id: "asc" } });
    return clases.map((clase) => ({ id: clase.id, nombre: clase.nombre }));
  }

  async buscarPorId(id: number): Promise<Clase | null> {
    const clase = await this.prisma.clase.findUnique({ where: { id } });
    return clase ? { id: clase.id, nombre: clase.nombre } : null;
  }

  async crear(datos: CrearClaseDto): Promise<Clase> {
    const clase = await this.prisma.clase.create({
      data: { nombre: datos.nombre, descripcion: "" },
    });
    return { id: clase.id, nombre: clase.nombre };
  }

  async actualizar(
    id: number,
    datos: ActualizarClaseDto,
  ): Promise<Clase | null> {
    const existente = await this.prisma.clase.findUnique({ where: { id } });
    if (!existente) return null;

    const clase = await this.prisma.clase.update({
      where: { id },
      data: datos,
    });
    return { id: clase.id, nombre: clase.nombre };
  }

  async eliminar(id: number): Promise<Clase | null> {
    const existente = await this.prisma.clase.findUnique({ where: { id } });
    if (!existente) return null;

    const clase = await this.prisma.clase.delete({ where: { id } });
    return { id: clase.id, nombre: clase.nombre };
  }
}
