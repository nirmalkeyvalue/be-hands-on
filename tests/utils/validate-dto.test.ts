import { describe, expect, it } from "vitest";
import { RegisterDto } from "../../dto/auth/register.dto";
import { UserRole } from "../../entities/user.entity";
import HttpException from "../../exception/http.exception";
import { validateDto } from "../../utils/validate-dto";

describe("validateDto", () => {
  it("throws HttpException 400 with serialized validation errors when input is invalid", async () => {
    await expect(validateDto(RegisterDto, { email: "not-an-email" })).rejects.toSatisfy((err: unknown) => {
      if (!(err instanceof HttpException)) return false;
      if (err.status !== 400) return false;
      const parsed = JSON.parse(err.message);
      return Array.isArray(parsed) && parsed.length > 0;
    });
  });

  it("returns a validated instance when input satisfies the DTO", async () => {
    const dto = await validateDto(RegisterDto, {
      name: "Ada",
      email: "ada@example.com",
      password: "secret",
      role: UserRole.USER,
    });
    expect(dto).toBeInstanceOf(RegisterDto);
    expect(dto.email).toBe("ada@example.com");
    expect(dto.role).toBe(UserRole.USER);
  });
});
