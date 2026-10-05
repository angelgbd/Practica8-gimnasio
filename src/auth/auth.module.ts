import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { USUARIO_REPOSITORY } from "./dominio/usuario.repository";
import { UsuarioPrismaRepository } from "./infra/usuario-prisma.repository";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./jwt.strategy";
import { getJwtSecret } from "./jwt-secret";

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: getJwtSecret(),
      signOptions: { expiresIn: "1h" },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    { provide: USUARIO_REPOSITORY, useClass: UsuarioPrismaRepository },
  ],
})
export class AuthModule {}
