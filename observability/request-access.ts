export type RequestAccessEntry = {
  method: string;
  originalUrl: string;
  statusCode: number;
  durationMs: number;
};

/**
 * Access / request-line logging. Replace internals to ship to your log platform.
 */
class RequestAccessLogger {
  logCompleted(entry: RequestAccessEntry): void {
    const { method, originalUrl, statusCode, durationMs } = entry;
    console.log(`${method} ${originalUrl} ${statusCode} ${durationMs}ms`);
  }
}

export const requestAccessLogger = new RequestAccessLogger();
export default RequestAccessLogger;
