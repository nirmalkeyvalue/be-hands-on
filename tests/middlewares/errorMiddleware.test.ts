import type { NextFunction, Request, Response } from "express";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import HttpException from "../../exception/http.exception";
import errorMiddleware from "../../middlewares/errorMiddleware";

function createMockRes() {
  const json = vi.fn();
  const send = vi.fn();
  const status = vi.fn().mockReturnValue({ json, send });
  return { res: { status } as unknown as Response, json, send, status };
}

describe("errorMiddleware", () => {
  const next = vi.fn() as NextFunction;

  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("responds with JSON message and HttpException status", () => {
    const { res, json, status } = createMockRes();
    const err = new HttpException(404, "Order not found");

    errorMiddleware(err, {} as Request, res, next);

    expect(status).toHaveBeenCalledWith(404);
    expect(json).toHaveBeenCalledWith({ message: "Order not found" });
    expect(next).not.toHaveBeenCalled();
  });

  it("logs stack and responds 500 with error message for non-HttpException errors", () => {
    const { res, send, status } = createMockRes();
    const err = new Error("Database unreachable");

    errorMiddleware(err, {} as Request, res, next);

    expect(status).toHaveBeenCalledWith(500);
    expect(send).toHaveBeenCalledWith({ error: "Database unreachable" });
    expect(console.error).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });
});
