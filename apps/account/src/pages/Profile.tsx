import { getHostServices } from "@/host-services";

export function Profile() {
  const { session } = getHostServices();
  if (!session.user) return null;
  const { user } = session;

  return (
    <div className="profile-card">
      <h2 style={{ marginTop: 0 }}>Profile</h2>
      <div className="profile-field">
        <span className="profile-field__label">Name</span>
        <span>{user.name}</span>
      </div>
      <div className="profile-field">
        <span className="profile-field__label">Email</span>
        <span>{user.email}</span>
      </div>
      <div className="profile-field">
        <span className="profile-field__label">Tier</span>
        <span style={{ textTransform: "capitalize" }}>{user.tier}</span>
      </div>
      <div className="profile-field">
        <span className="profile-field__label">User ID</span>
        <span style={{ fontFamily: "monospace" }}>{user.id}</span>
      </div>
    </div>
  );
}
