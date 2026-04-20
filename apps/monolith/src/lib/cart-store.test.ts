import { describe, it, expect, beforeEach } from "vitest";
import { useCart } from "./cart-store";

describe("cart store", () => {
  beforeEach(() => {
    useCart.getState().clear();
  });

  it("adds a new line for a product", () => {
    useCart.getState().add("p-001", 2);
    const { lines } = useCart.getState();
    expect(lines).toHaveLength(1);
    expect(lines[0]).toEqual({ productId: "p-001", quantity: 2 });
  });

  it("increments quantity when adding an existing product", () => {
    useCart.getState().add("p-001", 1);
    useCart.getState().add("p-001", 3);
    expect(useCart.getState().lines[0].quantity).toBe(4);
  });

  it("removes a line", () => {
    useCart.getState().add("p-001");
    useCart.getState().add("p-002");
    useCart.getState().remove("p-001");
    const lines = useCart.getState().lines;
    expect(lines).toHaveLength(1);
    expect(lines[0].productId).toBe("p-002");
  });

  it("sets quantity directly", () => {
    useCart.getState().add("p-001");
    useCart.getState().setQuantity("p-001", 7);
    expect(useCart.getState().lines[0].quantity).toBe(7);
  });

  it("totals items across lines", () => {
    useCart.getState().add("p-001", 2);
    useCart.getState().add("p-002", 3);
    expect(useCart.getState().totalItems()).toBe(5);
  });

  it("clears the cart", () => {
    useCart.getState().add("p-001", 2);
    useCart.getState().clear();
    expect(useCart.getState().lines).toEqual([]);
  });
});
