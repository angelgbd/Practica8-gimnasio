import {
  IsEmail,
  MinLength,
} from "class-validator";

export class RegistroDto {
  @IsEmail({}, { message: "el correo no tiene un formato valido" })
  correo!: string;

  @MinLength(8, {
    message: "la contrasena debe tener al menos 8 caracteres",
  })
  password!: string;

}

export class LoginDto {
  @IsEmail({}, { message: "el correo no tiene un formato valido" })
  correo!: string;

  @MinLength(1, { message: "la contrasena es obligatoria" })
  password!: string;
}

export class TokenDto {
  access_token!: string;
  token_type!: string;
  expires_in!: number;
}
