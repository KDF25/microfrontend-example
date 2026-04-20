import { Link } from "react-router-dom";
import { Navigation } from "./Navigation";
import { UserMenu } from "./UserMenu";
import { CartIndicator } from "./CartIndicator";

// The Header is owned by the host. It only uses host-local state
// (useCart, getSession) — it does NOT reach into remotes. If a remote needs
// to influence header content, it must go through a host contract, not by
// mutating DOM or importing remote state.
export function Header() {
  return (
    <header className="header">
      <div className="header__top">
        <Link to="/" className="header__brand">
          <span className="brand-mark">◆</span> Acme Shop
        </Link>
        <div className="header__actions">
          <CartIndicator />
          <UserMenu />
        </div>
      </div>
      <nav className="nav">
        <Navigation />
      </nav>
    </header>
  );
}
