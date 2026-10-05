import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import type { NuevoUsuario, Usuario } from "../dominio/usuario";
import { Rol } from "../dominio/usuario";
import type { UsuarioRepository } from "../dominio/usuario.repository";

@Injectable()
export class UsuarioPrismaRepository implements UsuarioRepository {
  constructor(private readonly prisma: PrismaService) {}

  async buscarPorCorreo(correo: string): Promise<Usuario | null> {
    const fila = await this.prisma.usuario.findUnique({
      where: { correo: correo.trim().toLowerCase() },
    });
    return fila ? { ...fila, rol: fila.rol as Rol } : null;
  }

  async guardar(nuevo: NuevoUsuario): Promise<Usuario> {
    const fila = await this.prisma.usuario.create({
      data: {
        ...nuevo,
        correo: nuevo.correo.trim().toLowerCase(),
      },
    });
    return { ...fila, rol: fila.rol as Rol };
  }
}
