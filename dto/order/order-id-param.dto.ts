import { IsNotEmpty, IsNumberString } from "class-validator";

export class OrderIdParamDto {
  @IsNotEmpty()
  @IsNumberString({ no_symbols: true })
  id!: string;
}
