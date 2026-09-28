import { IsInt, IsString } from "class-validator";

export class CrearHorarioDto {
  @IsInt()
  claseId: number;

  @IsString()
  dia: string;

  @IsString()
  horaInicio: string;

  @IsInt()
  cupoMaximo: number;

  @IsString()
  entrenador: string;
}
