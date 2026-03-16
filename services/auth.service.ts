import User, { UserRole } from "../entities/user.entity";
import HttpException from "../exception/http.exception";
import AuthRepository from "../repositories/auth.repository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_VALIDITY } from "../utils/constants";

export interface JwtPayload {
  id: number;
  email: string;
  role: UserRole;
}

class AuthService {
  constructor(private authRepository: AuthRepository) {}

  async registerAccount(user: User): Promise<any> {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;

    const newUser = await this.authRepository.createUser(user);

    return {
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
    }
  }

  async login(email: string, password: string) {
    const user = await this.authRepository.findUserByEmail(email);

    if (!user) {
      throw new HttpException(400, "User not found");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new HttpException(400, "Invalid password");
    }

    const jwtPayload: JwtPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    const token = jwt.sign(jwtPayload, JWT_SECRET as string, {
      expiresIn: 60 * 60, // 1 hour
    });

    return { token };
  }
}

export default AuthService;