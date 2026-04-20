import { NavLink, Outlet } from "react-router-dom";

export function AccountLayout() {
  return (
    <>
      <h1 className="section-title" style={{ marginTop: 0 }}>Account</h1>
      <div className="account-layout">
        <aside className="account-sidebar">
          <ul className="account-sidebar__list">
            <li>
              <NavLink
                to=""
                end
                className={({ isActive }) =>
                  "account-sidebar__link" +
                  (isActive ? " account-sidebar__link--active" : "")
                }
              >
                Overview
              </NavLink>
            </li>
            <li>
              <NavLink
                to="profile"
                className={({ isActive }) =>
                  "account-sidebar__link" +
                  (isActive ? " account-sidebar__link--active" : "")
                }
              >
                Profile
              </NavLink>
            </li>
            <li>
              <NavLink
                to="orders"
                className={({ isActive }) =>
                  "account-sidebar__link" +
                  (isActive ? " account-sidebar__link--active" : "")
                }
              >
                Orders
              </NavLink>
            </li>
          </ul>
        </aside>
        <section>
          <Outlet />
        </section>
      </div>
    </>
  );
}
