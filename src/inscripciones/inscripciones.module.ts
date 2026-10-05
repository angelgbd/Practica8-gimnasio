import { Module } from "@nestjs/common";
import { InscripcionesController } from "./inscripciones.controller";
import { InscripcionesService } from "./inscripciones.service";
import { InscripcionPrismaRepository } from "./infra/inscripcion-prisma.repository";
import { INSCRIPCION_REPOSITORY } from "./inscripciones.tokens";
import { RolesGuard } from "../auth/guards/roles.guard";

@Module({
  controllers: [InscripcionesController],
  providers: [
    InscripcionesService,
    RolesGuard,
    {
      provide: INSCRIPCION_REPOSITORY,
      useClass: InscripcionPrismaRepository,
    },
  ],
})
export class InscripcionesModule {}
