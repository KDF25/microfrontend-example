import { Link } from "react-router-dom";
import { Button } from "@/components/Button";
import { useCart } from "@/lib/cart-store";
import { formatPrice } from "@/lib/format";

// Checkout stays in the host for this reference solution because:
//   - it aggregates cart lines from every domain
//   - it calls the payment provider, which the host owns
//   - it shouldn't gain a new deploy surface just to render a summary
//
// A defensible alternative: extract Checkout as a third remote if the
// checkout team is staffed separately. Discuss trade-offs in MENTOR_NOTES.
export function Checkout() {
  const lines = useCart((s) => s.lines);
  const setQuantity = useCart((s) => s.setQuantity);
  const remove = useCart((s) => s.remove);
  const clear = useCart((s) => s.clear);

  // Price lookup is stubbed — in production the host calls a pricing API
  // instead of asking the catalog remote for product data. (Cross-remote
  // data calls are an anti-pattern: they couple deploys.)
  const PLACEHOLDER_PRICE_CENTS = 2999;
  const subtotalCents = lines.reduce(
    (sum, l) => sum + PLACEHOLDER_PRICE_CENTS * l.quantity,
    0,
  );
  const shippingCents = subtotalCents > 0 && subtotalCents < 5000 ? 499 : 0;
  const totalCents = subtotalCents + shippingCents;

  if (lines.length === 0) {
    return (
      <>
        <h1 className="section-title" style={{ marginTop: 0 }}>Checkout</h1>
        <div className="empty-state">
          <p>Your cart is empty.</p>
          <Link to="/catalog">
            <Button variant="primary">Browse catalog</Button>
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <h1 className="section-title" style={{ marginTop: 0 }}>Checkout</h1>
      <div className="checkout">
        <div>
          {lines.map((line) => (
            <div className="checkout__line" key={line.productId}>
              <div className="checkout__line-body">
                <div className="checkout__line-title">Product {line.productId}</div>
                <div style={{ color: "var(--text-muted)", fontSize: 13 }}>
                  {formatPrice(PLACEHOLDER_PRICE_CENTS)}
                </div>
                <div className="checkout__line-actions" style={{ marginTop: 8 }}>
                  <label style={{ fontSize: 13 }}>
                    Qty{" "}
                    <input
                      className="qty-input"
                      type="number"
                      min={1}
                      max={99}
                      value={line.quantity}
                      onChange={(e) =>
                        setQuantity(line.productId, Number(e.target.value) || 1)
                      }
                    />
                  </label>
                  <button
                    className="btn btn--ghost btn--sm"
                    onClick={() => remove(line.productId)}
                  >
                    Remove
                  </button>
                </div>
              </div>
              <div style={{ fontWeight: 600 }}>
                {formatPrice(PLACEHOLDER_PRICE_CENTS * line.quantity)}
              </div>
            </div>
          ))}
          <button className="btn btn--ghost btn--sm" onClick={clear} style={{ marginTop: 12 }}>
            Clear cart
          </button>
        </div>
        <aside className="checkout__summary">
          <h3 style={{ marginTop: 0 }}>Summary</h3>
          <div className="checkout__summary-row">
            <span>Subtotal</span><span>{formatPrice(subtotalCents)}</span>
          </div>
          <div className="checkout__summary-row">
            <span>Shipping</span>
            <span>{shippingCents === 0 ? "Free" : formatPrice(shippingCents)}</span>
          </div>
          <div className="checkout__summary-row checkout__summary-row--total">
            <span>Total</span><span>{formatPrice(totalCents)}</span>
          </div>
          <Button
            variant="primary"
            size="lg"
            style={{ width: "100%", marginTop: 16 }}
            onClick={() => alert("Payment provider is mocked — nothing charged.")}
          >
            Place order
          </Button>
        </aside>
      </div>
    </>
  );
}
