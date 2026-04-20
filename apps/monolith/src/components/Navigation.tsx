import { NavLink } from "react-router-dom";

// ---------------------------------------------------------------------------
// Intentional smell: Navigation hard-codes routes from every domain.
// After the MF split, the host owns navigation and each microfrontend
// declares its own routes through a manifest the host consumes.
// ---------------------------------------------------------------------------

const NAV_ITEMS = [
  { to: "/catalog", label: "Catalog", domain: "catalog" as const },
  { to: "/account", label: "Account", domain: "account" as const },
  { to: "/checkout", label: "Checkout", domain: "checkout" as const },
];

export function Navigation() {
  return (
    <nav className="nav" aria-label="Primary">
      <ul className="nav__list">
        {NAV_ITEMS.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                `nav__link ${isActive ? "nav__link--active" : ""}`.trim()
              }
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
