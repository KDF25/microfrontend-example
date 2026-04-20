import { Link } from "react-router-dom";
import { useHostServices } from "@/lib/host-services";

export function CartIndicator() {
  const { cartCount } = useHostServices();
  return (
    <Link to="/checkout" className="cart-indicator" aria-label="Cart">
      <span className="cart-indicator__icon">🛒</span>
      {cartCount > 0 && <span className="cart-indicator__count">{cartCount}</span>}
    </Link>
  );
}
