import type { Session } from "@/types";

// Mock session. In a real system the host is the only app that talks to the
// identity provider; remotes receive a narrowed, immutable session snapshot
// via context or a shared `getSession()` contract.
let cached: Session | null = null;

export function getSession(): Session {
  if (cached) return cached;
  cached = {
    user: {
      id: "u-001",
      email: "avery@acme.test",
      name: "Avery Chen",
      tier: "plus",
    },
    isAuthenticated: true,
  };
  return cached;
}
