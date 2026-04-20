import { getSession } from "@/lib/auth";
import { getOrdersForUser } from "@/lib/data/users";
import { formatDate, formatPrice } from "@/lib/format";
import { isEnabled } from "@/lib/features";

export function Orders() {
  const { user } = getSession();
  if (!user) return <p>Sign in required.</p>;
  const orders = getOrdersForUser(user.id);
  const canExport = isEnabled("ordersExport");
  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 className="section-title" style={{ marginTop: 0 }}>Orders</h2>
        {canExport && (
          <button className="btn btn--secondary btn--sm" disabled>Export (soon)</button>
        )}
      </div>
      {orders.length === 0 ? (
        <p className="empty-state">You haven&apos;t placed any orders yet.</p>
      ) : (
        <div className="order-list">
          {orders.map((o) => (
            <div className="order-card" key={o.id}>
              <div className="order-card__head">
                <span className="order-card__id">#{o.id}</span>
                <span className={`order-card__status order-card__status--${o.status}`}>
                  {o.status}
                </span>
              </div>
              <div className="order-card__meta">
                <span>Placed {formatDate(o.createdAt)}</span>
                <span>{o.items.length} items</span>
                <span>{formatPrice(o.totalCents)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
