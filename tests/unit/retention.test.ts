import { describe, expect, it } from "vitest";
import { calculateChurnRisk, getRetentionRecommendations } from "@/features/retention/service";

describe("retention engine", () => {
  it("maps scores to churn levels", () => {
    expect(calculateChurnRisk(20)).toBe("CRITICAL");
    expect(calculateChurnRisk(50)).toBe("HIGH");
    expect(calculateChurnRisk(60)).toBe("MEDIUM");
    expect(calculateChurnRisk(80)).toBe("LOW");
  });

  it("recommends renewal near expiry", () => {
    const actions = getRetentionRecommendations({
      score: 40,
      churnRisk: "HIGH",
      daysSinceLastVisit: 12,
      membershipDaysLeft: 5,
      visitsThisMonth: 1,
    });
    expect(actions.some((a) => a.includes("تمدید"))).toBe(true);
    expect(actions.length).toBeGreaterThan(0);
  });
});
