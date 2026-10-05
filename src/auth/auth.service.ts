import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import type { PayloadJwt, Usuario } from "./dominio/usuario";
import { Rol } from "./dominio/usuario";
import {
  USUARIO_REPOSITORY,
  type UsuarioRepository,
} from "./dominio/usuario.repository";
import { LoginDto, RegistroDto, TokenDto } from "./dto/auth.dto";

const VUELTAS_BCRYPT = 10;

@Injectable()
export class AuthService {
  constructor(
    @Inject(USUARIO_REPOSITORY)
    private readonly usuarios: UsuarioRepository,
    private readonly jwt: JwtService,
  ) {}

  async registrar(dto: RegistroDto): Promise<TokenDto> {
    const correo = dto.correo.trim().toLowerCase();
    if (await this.usuarios.buscarPorCorreo(correo)) {
      throw new ConflictException("Ese correo ya esta registrado");
    }

    const usuario = await this.usuarios.guardar({
      correo,
      passwordHash: await bcrypt.hash(dto.password, VUELTAS_BCRYPT),
      rol: dto.rol ?? Rol.miembro,
      miembroId: dto.miembroId ?? null,
    });
    return this.firmar(usuario);
  }

  async login(dto: LoginDto): Promise<TokenDto> {
    const usuario = await this.usuarios.buscarPorCorreo(
      dto.correo.trim().toLowerCase(),
    );
    const credencialesInvalidas = () =>
      new UnauthorizedException("Credenciales invalidas");

    if (!usuario) throw credencialesInvalidas();
    if (!(await bcrypt.compare(dto.password, usuario.passwordHash))) {
      throw credencialesInvalidas();
    }
    return this.firmar(usuario);
  }

  private async firmar(usuario: Usuario): Promise<TokenDto> {
    const payload: PayloadJwt = {
      sub: usuario.id,
      correo: usuario.correo,
      rol: usuario.rol,
      miembroId: usuario.miembroId,
    };

    return {
      access_token: await this.jwt.signAsync(payload),
      token_type: "Bearer",
      expires_in: 3600,
    };
  }
}
