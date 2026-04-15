import { describe, expect, it, vi } from "vitest";
import HttpException from "../../exception/http.exception";
import type AuthRepository from "../../repositories/auth.repository";
import AuthService from "../../services/auth.service";

describe("AuthService.login", () => {
  it("throws HttpException when no user exists for the email", async () => {
    const authRepository = {
      findUserByEmail: vi.fn().mockResolvedValue(null),
      createUser: vi.fn(),
    } as unknown as AuthRepository;
    const authService = new AuthService(authRepository);

    await expect(authService.login("missing@example.com", "any-password")).rejects.toSatisfy(
      (err: unknown) =>
        err instanceof HttpException && err.status === 400 && err.message === "User not found"
    );
    expect(authRepository.findUserByEmail).toHaveBeenCalledTimes(1);
    expect(authRepository.findUserByEmail).toHaveBeenCalledWith("missing@example.com");
  });
});
