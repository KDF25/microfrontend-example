import { getCurrentUser } from "./data/users";
import type { User } from "@/types";

// ---------------------------------------------------------------------------
// Intentional smell: "auth" is a plain module imported directly by components
// from all domains. When you split into microfrontends, auth needs to become
// a contract that the host provides and remotes consume (e.g. via a shared
// package and a React context owned by the host).
// ---------------------------------------------------------------------------

export interface Session {
  user: User | null;
  isAuthenticated: boolean;
}

let cached: Session | null = null;

export function getSession(): Session {
  if (cached) return cached;
  const user = getCurrentUser();
  cached = { user, isAuthenticated: Boolean(user) };
  return cached;
}
