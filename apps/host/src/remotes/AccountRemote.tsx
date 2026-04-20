import { lazy } from "react";
import { RemoteBoundary } from "@/components/RemoteBoundary";

const AccountApp = lazy(() => import("account/AccountApp"));

export function AccountRemote() {
  return (
    <RemoteBoundary name="account">
      <AccountApp />
    </RemoteBoundary>
  );
}
