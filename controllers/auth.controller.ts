import express from "express";
import AuthService from "../services/auth.service";

class AuthController {
  router: express.Router;

  constructor(private authService: AuthService) {
    this.router = express.Router();

    this.router.post("/register", this.register.bind(this));
    this.router.post("/login", this.login.bind(this));
  }

  public register = async (req: express.Request, res: express.Response) => {
    const newUser = await this.authService.registerAccount(req.body);
    res.status(200).json({ data: newUser });
  };

  public login = async (req: express.Request, res: express.Response) => {
    const { email, password } = req.body;
    const loginResponse = await this.authService.login(email, password);
    res.status(201).json({ data: loginResponse });
  };
}

export default AuthController;