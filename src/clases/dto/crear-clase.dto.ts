import { IsString } from "class-validator";

export class CrearClaseDto {
  @IsString()
  nombre: string;
}
