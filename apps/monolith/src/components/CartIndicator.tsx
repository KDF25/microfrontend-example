import { Link } from "react-router-dom";
import { useCart } from "@/lib/cart-store";

export function CartIndicator() {
  const totalItems = useCart((s) => s.totalItems());
  return (
    <Link to="/checkout" className="cart-indicator" aria-label="Open cart">
      <span className="cart-indicator__icon" aria-hidden>⛾</span>
      <span className="cart-indicator__count" data-testid="cart-count">{totalItems}</span>
    </Link>
  );
}
