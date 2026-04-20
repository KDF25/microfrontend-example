import { Link, Outlet } from "react-router-dom";

export function AccountLayout() {
  return (
    <div className="account-layout">
      <aside className="account-sidebar">
        <h2 className="section-title" style={{ marginTop: 0 }}>Account</h2>
        <ul className="account-sidebar__list">
          <li><Link to="/account" className="account-sidebar__link">Overview</Link></li>
          <li><Link to="/account/profile" className="account-sidebar__link">Profile</Link></li>
          <li><Link to="/account/orders" className="account-sidebar__link">Orders</Link></li>
        </ul>
      </aside>
      <section>
        <Outlet />
      </section>
    </div>
  );
}
