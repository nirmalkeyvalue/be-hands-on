export type HttpExceptionLog = {
  method: string;
  originalUrl: string;
  status: number;
  message: string;
};

export type UnhandledRouteErrorLog = {
  method: string;
  originalUrl: string;
  error: Error;
};

/**
 * HTTP and middleware error logging. Swap implementation for Datadog, CloudWatch, etc.
 */
class HttpErrorLogger {
  logHttpException(entry: HttpExceptionLog): void {
    const { method, originalUrl, status, message } = entry;
    const line = `[HTTP ${status}] ${method} ${originalUrl} — ${message}`;
    if (status >= 500) {
      console.error(line);
    } else {
      console.warn(line);
    }
  }

  logUnhandledRouteError(entry: UnhandledRouteErrorLog): void {
    const { method, originalUrl, error } = entry;
    console.error(`${method} ${originalUrl}`, error.stack ?? error.message);
  }

  logErrorMiddlewareFault(err: unknown): void {
    console.error("[errorMiddleware] failed while handling error", err);
  }
}

export const httpErrorLogger = new HttpErrorLogger();
export default HttpErrorLogger;
