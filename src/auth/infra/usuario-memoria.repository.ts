import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcryptjs";
import type { NuevoUsuario, Usuario } from "../dominio/usuario";
import { Rol } from "../dominio/usuario";
import type { UsuarioRepository } from "../dominio/usuario.repository";

const CUENTAS: Omit<NuevoUsuario, "passwordHash">[] = [
  { correo: "karla@itson.mx", rol: Rol.miembro, miembroId: 1 },
  { correo: "ana@itson.mx", rol: Rol.entrenador, miembroId: null },
  { correo: "admin@itson.mx", rol: Rol.admin, miembroId: null },
];

@Injectable()
export class UsuarioMemoriaRepository implements UsuarioRepository {
  private readonly datos = new Map<number, Usuario>();
  private siguienteId = 1;

  constructor() {
    const passwordHash = bcrypt.hashSync("gimnasio2026", 10);
    for (const cuenta of CUENTAS) {
      void this.guardar({ ...cuenta, passwordHash });
    }
  }

  async buscarPorCorreo(correo: string): Promise<Usuario | null> {
    const buscado = correo.trim().toLowerCase();
    return [...this.datos.values()].find((usuario) => usuario.correo === buscado) ?? null;
  }

  async guardar(nuevo: NuevoUsuario): Promise<Usuario> {
    const usuario: Usuario = {
      ...nuevo,
      correo: nuevo.correo.trim().toLowerCase(),
      id: this.siguienteId++,
      creadoEn: new Date(),
    };
    this.datos.set(usuario.id, usuario);
    return usuario;
  }
}
