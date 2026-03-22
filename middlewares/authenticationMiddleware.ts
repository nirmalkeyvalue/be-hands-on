import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../utils/constants";
import { JwtPayload } from "../dto/jwt-payload.dto";
import HttpException from "../exception/http.exception";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

const getToken = (req: Request): string | undefined => {
  const token = req.headers.authorization;
  if (!token) {
    return undefined;
  }
  return token.replace("Bearer ", "");
};

const authenticationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = getToken(req);
  if (!token) {
    throw new HttpException(401, "Unauthorized");
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET || '') as unknown as JwtPayload;
    req.user = decoded;
    next();
  } catch (error) {
    throw new HttpException(401, "Unauthorized");
  }
};

export default authenticationMiddleware;
