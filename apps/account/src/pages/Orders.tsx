import { getHostServices } from "@/host-services";
import { getOrdersForUser } from "@/data/orders";
import { formatDate, formatPrice } from "@/lib/format";

export function Orders() {
  const { session } = getHostServices();
  if (!session.user) return null;
  const orders = getOrdersForUser(session.user.id);

  if (orders.length === 0) {
    return <div className="empty-state">No orders yet.</div>;
  }

  return (
    <>
      <h2 className="section-title" style={{ marginTop: 0 }}>Orders</h2>
      <div className="order-list">
        {orders.map((order) => (
          <article className="order-card" key={order.id}>
            <div className="order-card__head">
              <span className="order-card__id">{order.id}</span>
              <span className={`order-card__status order-card__status--${order.status}`}>
                {order.status}
              </span>
            </div>
            <div className="order-card__meta">
              <span>{formatDate(order.createdAt)}</span>
              <span>
                {order.items.length} item{order.items.length === 1 ? "" : "s"}
              </span>
              <span>{formatPrice(order.totalCents)}</span>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
