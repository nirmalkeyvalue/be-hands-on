import express from "express";
import { LoginDto } from "../dto/auth/login.dto";
import { RegisterDto } from "../dto/auth/register.dto";
import User from "../entities/user.entity";
import AuthService from "../services/auth.service";
import { validateDto } from "../utils/validate-dto";

class AuthController {
  router: express.Router;

  constructor(private authService: AuthService) {
    this.router = express.Router();

    this.router.post("/register", this.register.bind(this));
    this.router.post("/login", this.login.bind(this));
  }

  public register = async (req: express.Request, res: express.Response) => {
    const dto = await validateDto(RegisterDto, req.body);
    const user = new User();
    user.name = dto.name;
    user.email = dto.email;
    user.password = dto.password;
    user.role = dto.role;
    const newUser = await this.authService.registerAccount(user);
    res.status(200).json({ data: newUser });
  };

  public login = async (req: express.Request, res: express.Response) => {
    const dto = await validateDto(LoginDto, req.body);
    const loginResponse = await this.authService.login(dto.email, dto.password);
    res.status(201).json({ data: loginResponse });
  };
}

export default AuthController;