import { Link } from "react-router-dom";
import { Navigation } from "./Navigation";
import { UserMenu } from "./UserMenu";
import { CartIndicator } from "./CartIndicator";
import { getFeatureFlags } from "@/lib/features";

// ---------------------------------------------------------------------------
// Intentional smell: the header pulls from three bounded contexts at once
// (auth via UserMenu, cart via CartIndicator, feature flags here). The
// refactor should make the host the only place that knows "there's a
// UserMenu + a CartIndicator here" and let each remote expose its own widget
// through a shared slot API or via a narrow host-exposed action.
// ---------------------------------------------------------------------------

export function Header() {
  const flags = getFeatureFlags();
  return (
    <header className="header">
      <div className="header__top">
        <Link to="/" className="header__brand">
          <span className="brand-mark">◎</span>
          <span className="brand-name">Meridian Store</span>
        </Link>
        <div className="header__actions">
          <CartIndicator />
          <UserMenu />
        </div>
      </div>
      {flags.promoBanner && (
        <div className="header__banner">
          Spring sale — free shipping on orders over $50 until April 30.
        </div>
      )}
      <Navigation />
    </header>
  );
}
