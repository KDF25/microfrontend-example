import { getSession } from "@/lib/auth";
import { formatDate } from "@/lib/format";

export function Profile() {
  const { user } = getSession();
  if (!user) return <p>Sign in required.</p>;
  return (
    <>
      <h2 className="section-title" style={{ marginTop: 0 }}>Profile</h2>
      <div className="profile-card">
        <div className="profile-field">
          <span className="profile-field__label">Name</span><span>{user.name}</span>
        </div>
        <div className="profile-field">
          <span className="profile-field__label">Email</span><span>{user.email}</span>
        </div>
        <div className="profile-field">
          <span className="profile-field__label">Tier</span><span>{user.tier}</span>
        </div>
        <div className="profile-field">
          <span className="profile-field__label">Member since</span>
          <span>{formatDate(user.createdAt)}</span>
        </div>
        <div className="profile-field">
          <span className="profile-field__label">User ID</span>
          <span style={{ fontFamily: "ui-monospace, monospace", fontSize: 13 }}>{user.id}</span>
        </div>
      </div>
    </>
  );
}
