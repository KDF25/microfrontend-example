import { NavLink } from "react-router-dom";

// Known limitation: the top-nav has a hardcoded list of links. The host has
// to know a priori that `/catalog` and `/account` are the entry routes of the
// catalog and account remotes. A more advanced setup reads this from a
// remote manifest — but simple is usually better.
const ITEMS = [
  { to: "/", label: "Home", end: true },
  { to: "/catalog", label: "Catalog" },
  { to: "/account", label: "Account" },
  { to: "/checkout", label: "Checkout" },
];

export function Navigation() {
  return (
    <ul className="nav__list">
      {ITEMS.map((item) => (
        <li key={item.to}>
          <NavLink
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              "nav__link" + (isActive ? " nav__link--active" : "")
            }
          >
            {item.label}
          </NavLink>
        </li>
      ))}
    </ul>
  );
}
