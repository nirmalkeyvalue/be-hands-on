import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import HttpException from "../exception/http.exception";

export async function validateDto<T extends object>(
  Cls: new () => T,
  plain: unknown
): Promise<T> {
  const instance = plainToInstance(Cls, plain as object);
  const errors = await validate(instance);
  if (errors.length > 0) {
    throw new HttpException(400, JSON.stringify(errors));
  }
  return instance;
}
