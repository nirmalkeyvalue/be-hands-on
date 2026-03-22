import { UserRole } from "../entities/user.entity";

export type JwtPayload = {
  id: number;
  email: string;
  role: UserRole;
}
