import { Link } from "react-router-dom";
import { getSession } from "@/lib/auth";

export function UserMenu() {
  const { user, isAuthenticated } = getSession();
  if (!isAuthenticated || !user) {
    return (
      <Link to="/account" className="user-menu user-menu--anon">
        Sign in
      </Link>
    );
  }
  return (
    <Link to="/account" className="user-menu" title={user.email}>
      <span className="user-menu__avatar" aria-hidden>
        {user.name.charAt(0)}
      </span>
      <span className="user-menu__name">{user.name}</span>
      <span className={`user-menu__tier user-menu__tier--${user.tier}`}>{user.tier}</span>
    </Link>
  );
}
