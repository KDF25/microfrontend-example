import { useHostServices } from "@/lib/host-services";

export function UserMenu() {
  const { session } = useHostServices();

  if (!session.isAuthenticated || !session.user) {
    return (
      <div className="user-menu user-menu--anon">
        <span style={{ color: "var(--text-muted)", fontSize: 14 }}>Sign in</span>
      </div>
    );
  }

  const { user } = session;
  const initial = user.name.charAt(0).toUpperCase();
  const tierClass = user.tier !== "free" ? `user-menu__tier--${user.tier}` : "";

  return (
    <div className="user-menu">
      <span className="user-menu__avatar">{initial}</span>
      <span className="user-menu__name">{user.name}</span>
      <span className={`user-menu__tier ${tierClass}`}>{user.tier}</span>
    </div>
  );
}
