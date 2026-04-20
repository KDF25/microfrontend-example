import { Link } from "react-router-dom";
import { getSession } from "@/lib/auth";
import { getOrdersForUser } from "@/lib/data/users";
import { formatDate, formatPrice } from "@/lib/format";

export function AccountOverview() {
  const { user } = getSession();
  if (!user) {
    return (
      <div className="profile-card">
        <h2 style={{ marginTop: 0 }}>Sign in required</h2>
      </div>
    );
  }
  const orders = getOrdersForUser(user.id);
  const latest = orders[0];
  return (
    <>
      <div className="profile-card">
        <h2 style={{ marginTop: 0 }}>Welcome back, {user.name.split(" ")[0]}</h2>
        <p style={{ color: "var(--text-muted)", marginBottom: 0 }}>
          You are on the <strong>{user.tier}</strong> plan. Thanks for being with us
          since {formatDate(user.createdAt)}.
        </p>
      </div>
      <h3 className="section-title">Most recent order</h3>
      {latest ? (
        <div className="order-card">
          <div className="order-card__head">
            <span className="order-card__id">#{latest.id}</span>
            <span className={`order-card__status order-card__status--${latest.status}`}>
              {latest.status}
            </span>
          </div>
          <div className="order-card__meta">
            <span>Placed {formatDate(latest.createdAt)}</span>
            <span>{latest.items.length} items</span>
            <span>{formatPrice(latest.totalCents)}</span>
          </div>
          <p style={{ marginTop: 12 }}>
            <Link to="/account/orders">View all orders →</Link>
          </p>
        </div>
      ) : (
        <p className="empty-state">No orders yet.</p>
      )}
    </>
  );
}
