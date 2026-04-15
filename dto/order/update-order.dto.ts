import { Type } from "class-transformer";
import { IsEnum, IsObject, IsOptional, IsString, ValidateNested } from "class-validator";
import { OrderStatus } from "../../entities/order.entity";

export class UpdateOrderPropertiesDto {
  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;
}

export class UpdateOrderRequestDto {
  @IsObject()
  @ValidateNested()
  @Type(() => UpdateOrderPropertiesDto)
  updateOrderProperties!: UpdateOrderPropertiesDto;
}
