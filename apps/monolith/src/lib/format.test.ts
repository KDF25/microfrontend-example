import { describe, it, expect } from "vitest";
import { formatPrice, formatDate } from "./format";

describe("formatPrice", () => {
  it("formats USD cents as a currency string", () => {
    expect(formatPrice(1999)).toBe("$19.99");
  });

  it("handles zero cents", () => {
    expect(formatPrice(0)).toBe("$0.00");
  });

  it("supports EUR", () => {
    expect(formatPrice(1250, "EUR")).toMatch(/€|EUR/);
  });
});

describe("formatDate", () => {
  it("formats ISO date strings", () => {
    const out = formatDate("2024-07-01T00:00:00.000Z");
    expect(out).toMatch(/2024/);
  });
});
