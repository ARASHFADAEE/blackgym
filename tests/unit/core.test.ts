import { describe, expect, it } from "vitest";
import { hasPermission, getDashboardPath } from "@/lib/permissions";
import { occupancyLevel } from "@/lib/dates/jalali";
import { MockGateway } from "@/lib/payments/mock-gateway";
import { toPersianDigits, formatToman } from "@/lib/utils";

describe("permissions", () => {
  it("allows athlete own workouts", () => {
    expect(hasPermission("ATHLETE", "workouts:own")).toBe(true);
    expect(hasPermission("ATHLETE", "users:roles")).toBe(false);
  });

  it("routes roles to correct dashboards", () => {
    expect(getDashboardPath("ATHLETE")).toBe("/athlete");
    expect(getDashboardPath("TRAINER")).toBe("/trainer");
    expect(getDashboardPath("ADMIN")).toBe("/admin");
  });
});

describe("occupancy", () => {
  it("maps percent to levels", () => {
    expect(occupancyLevel(10)).toBe("QUIET");
    expect(occupancyLevel(50)).toBe("MODERATE");
    expect(occupancyLevel(70)).toBe("BUSY");
    expect(occupancyLevel(90)).toBe("VERY_BUSY");
  });
});

describe("payments mock gateway", () => {
  it("creates and verifies mock payments", async () => {
    const gateway = new MockGateway();
    const created = await gateway.createPayment({
      amount: 1000,
      description: "test",
      callbackUrl: "http://localhost/callback",
    });
    expect(created.success).toBe(true);
    expect(created.authority.startsWith("mock_")).toBe(true);

    const verified = await gateway.verifyPayment({
      authority: created.authority,
      amount: 1000,
    });
    expect(verified.success).toBe(true);
  });
});

describe("utils", () => {
  it("formats persian digits and toman", () => {
    expect(toPersianDigits(12)).toBe("۱۲");
    expect(formatToman(1000)).toContain("تومان");
  });
});
