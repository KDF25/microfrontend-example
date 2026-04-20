// Cross-microfrontend contracts.
//
// Only put a type here when BOTH are true:
//   (a) it crosses an ownership boundary (host ↔ remote, or remote ↔ remote), AND
//   (b) it is stable enough that a breaking change would break deploys.
//
// Keep it narrow. In particular: domain internals (Cart lifecycle, Order
// status transitions, CatalogFilters) must stay inside the owning app and
// NOT leak into this package.

export interface SharedUser {
  id: string;
  email: string;
  name: string;
  tier: "free" | "plus" | "pro";
}

export interface SharedSession {
  user: SharedUser | null;
  isAuthenticated: boolean;
}

/**
 * HostServices is what the host promises every remote.
 * Breaking changes here = breaking changes for every remote. Version it.
 */
export interface HostServices {
  session: SharedSession;
  addToCart: (productId: string, quantity?: number) => void;
  cartCount: number;
}

export type RemoteName = "catalog" | "account";

/**
 * Runtime manifest for dynamic remote loading. The host fetches this at
 * startup so remote URLs can be rotated without a host rebuild.
 */
export interface RemoteManifestEntry {
  name: RemoteName;
  url: string;
  mountPath: string;
  version: string;
}

export interface RemoteManifest {
  generatedAt: string;
  remotes: RemoteManifestEntry[];
}
