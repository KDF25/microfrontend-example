import { Link } from "react-router-dom";
import { Button } from "@/components/Button";
import { useCart } from "@/lib/cart-store";
import { formatPrice } from "@/lib/format";
import { getProductById } from "@/lib/data/products";

export function Checkout() {
  const lines = useCart((s) => s.lines);
  const setQuantity = useCart((s) => s.setQuantity);
  const remove = useCart((s) => s.remove);
  const clear = useCart((s) => s.clear);

  const resolved = lines.map((line) => ({ line, product: getProductById(line.productId) }));
  const subtotalCents = resolved.reduce(
    (sum, r) => sum + (r.product?.priceCents ?? 0) * r.line.quantity,
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
          {resolved.map(({ line, product }) => {
            if (!product) return null;
            return (
              <div className="checkout__line" key={line.productId}>
                <div className="checkout__thumb">
                  <img src={product.imageUrl} alt={product.title} />
                </div>
                <div className="checkout__line-body">
                  <div className="checkout__line-title">{product.title}</div>
                  <div style={{ color: "var(--text-muted)", fontSize: 13 }}>
                    {formatPrice(product.priceCents, product.currency)}
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
                  {formatPrice(product.priceCents * line.quantity, product.currency)}
                </div>
              </div>
            );
          })}
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
