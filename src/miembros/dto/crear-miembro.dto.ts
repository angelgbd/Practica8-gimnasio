import { IsEmail, IsIn, IsString } from "class-validator";

export class CrearMiembroDto {
  @IsString()
  nombre: string;

  @IsEmail()
  correo: string;

  @IsIn(["basica", "plus", "premium"])
  membresia: string;
}
