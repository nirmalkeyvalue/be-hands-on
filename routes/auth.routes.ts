import AuthController from "../controllers/auth.controller";
import dataSource from "../db/data-source";
import User from "../entities/user.entity";
import AuthRepository from "../repositories/auth.repository";
import AuthService from "../services/auth.service";

const authRepository = new AuthRepository(dataSource.getRepository(User));

const authService = new AuthService(authRepository);
const authController = new AuthController(authService);
const authRouter = authController.router;

export default authRouter;