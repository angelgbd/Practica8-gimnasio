import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Res,
  UseGuards,
} from "@nestjs/common";
import type { Response } from "express";
import { InscripcionesService } from "./inscripciones.service";
import { CrearInscripcionDto } from "./dto/crear-inscripcion.dto";
import { aInscripcionDto } from "./dto/inscripcion-respuesta.dto";
import { UsuarioActual } from "../auth/decoradores/usuario-actual.decorator";
import { Roles } from "../auth/decoradores/roles.decorator";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Rol } from "../auth/dominio/usuario";
import type { PayloadJwt } from "../auth/dominio/usuario";

@Controller("inscripciones")
export class InscripcionesController {
  constructor(private readonly servicio: InscripcionesService) {}

  @Get()
  @Roles(Rol.entrenador, Rol.admin)
  @UseGuards(RolesGuard)
  async listar() {
    const lista = await this.servicio.listar();
    return lista.map(aInscripcionDto);
  }

  @Get("mias")
  async listarMias(@UsuarioActual() usuario: PayloadJwt) {
    if (usuario.rol !== Rol.miembro || usuario.miembroId === null) {
      throw new ForbiddenException(
        "Solo las cuentas vinculadas a un miembro pueden consultar sus inscripciones",
      );
    }

    const lista = await this.servicio.listarDeMiembro(usuario.miembroId);
    return lista.map(aInscripcionDto);
  }

  @Get(":id")
  async buscar(
    @Param("id") id: string,
    @UsuarioActual() usuario: PayloadJwt,
  ) {
    const inscripcion = await this.servicio.buscar(Number(id));
    if (!inscripcion) {
      throw new NotFoundException(`No existe la inscripcion ${id}`);
    }
    if (
      usuario.rol === Rol.miembro &&
      usuario.miembroId !== inscripcion.miembroId
    ) {
      throw new ForbiddenException("No puedes consultar la inscripcion de otra persona");
    }
    return aInscripcionDto(inscripcion);
  }

  @Post()
  @HttpCode(201)
  async crear(
    @Body() dto: CrearInscripcionDto,
    @UsuarioActual() usuario: PayloadJwt,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (usuario.rol !== Rol.miembro || usuario.miembroId === null) {
      throw new ForbiddenException(
        "Solo las cuentas vinculadas a un miembro pueden inscribirse a un horario",
      );
    }
    const inscripcion = await this.servicio.crear({
      horarioId: dto.horarioId,
      miembroId: usuario.miembroId,
    });
    res.setHeader("Location", `/inscripciones/${inscripcion.id}`);
    return aInscripcionDto(inscripcion);
  }

  @Delete(":id")
  @Roles(Rol.entrenador, Rol.admin)
  @UseGuards(RolesGuard)
  async cancelar(@Param("id") id: string) {
    const cancelada = await this.servicio.cancelar(Number(id));
    if (!cancelada) {
      throw new NotFoundException(`No existe la inscripcion ${id}`);
    }
    return aInscripcionDto(cancelada);
  }
}
