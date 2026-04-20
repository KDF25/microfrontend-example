import { Link } from "react-router-dom";
import { getHostServices } from "@/host-services";
import { getOrdersForUser } from "@/data/orders";
import { formatDate, formatPrice } from "@/lib/format";

export function AccountOverview() {
  const { session } = getHostServices();
  if (!session.user) return null;
  const orders = getOrdersForUser(session.user.id);
  const latest = orders[orders.length - 1];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div className="profile-card">
        <h2 style={{ marginTop: 0 }}>Welcome back, {session.user.name}</h2>
        <p style={{ color: "var(--text-muted)" }}>
          You have {orders.length} order{orders.length === 1 ? "" : "s"} on file.
        </p>
        <Link to="orders">
          <span className="btn btn--secondary btn--md">View all orders</span>
        </Link>
      </div>
      {latest && (
        <div className="profile-card">
          <h3 style={{ marginTop: 0 }}>Most recent order</h3>
          <div className="profile-field">
            <span className="profile-field__label">Order</span>
            <span>{latest.id}</span>
          </div>
          <div className="profile-field">
            <span className="profile-field__label">Placed</span>
            <span>{formatDate(latest.createdAt)}</span>
          </div>
          <div className="profile-field">
            <span className="profile-field__label">Total</span>
            <span>{formatPrice(latest.totalCents)}</span>
          </div>
          <div className="profile-field">
            <span className="profile-field__label">Status</span>
            <span style={{ textTransform: "capitalize" }}>{latest.status}</span>
          </div>
        </div>
      )}
    </div>
  );
}
