import { NextFunction, Request, Response } from "express";
import HttpException from "../exception/http.exception";
import { httpErrorLogger } from "../observability/http-errors";

const errorMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (error instanceof HttpException) {
      const status: number = error.status || 500;
      const message: string = error.message || "Something went wrong";
      httpErrorLogger.logHttpException({
        method: req.method,
        originalUrl: req.originalUrl,
        status,
        message,
      });
      const respbody = { message };
      res.status(status).json(respbody);
    } else {
      httpErrorLogger.logUnhandledRouteError({
        method: req.method,
        originalUrl: req.originalUrl,
        error,
      });
      res.status(500).send({ error: error.message });
    }
  } catch (err) {
    httpErrorLogger.logErrorMiddlewareFault(err);
    next(err);
  }
};

export default errorMiddleware;
