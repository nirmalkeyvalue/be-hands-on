import { NextFunction, Request, Response } from "express";
import { requestAccessLogger } from "../observability/request-access";

/** One line per request after the response is sent (method, path, status, duration). */
const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();
  res.on("finish", () => {
    requestAccessLogger.logCompleted({
      method: req.method,
      originalUrl: req.originalUrl,
      statusCode: res.statusCode,
      durationMs: Date.now() - start,
    });
  });
  next();
};

export default requestLogger;
