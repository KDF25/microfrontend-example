/**
 * Contract the host provides to the catalog remote.
 *
 * The host and the remote both import this type (ideally from
 * `packages/types` — for now duplicated here for clarity). The host calls
 * `setHostServices` before mounting the remote; the remote reads via
 * `getHostServices()`.
 *
 * This indirection is what keeps the two apps decoupled: neither imports
 * each other's internals, and the host can swap its cart/auth impl without
 * forcing a remote rebuild.
 */

export interface HostServices {
  session: {
    user: { id: string; email: string; name: string; tier: "free" | "plus" | "pro" } | null;
    isAuthenticated: boolean;
  };
  addToCart: (productId: string, quantity?: number) => void;
  cartCount: number;
}

declare global {
  interface Window {
    __HOST_SERVICES__?: HostServices;
  }
}

export function getHostServices(): HostServices {
  if (typeof window === "undefined" || !window.__HOST_SERVICES__) {
    throw new Error(
      "HostServices not injected. The host must set window.__HOST_SERVICES__ " +
        "before rendering the catalog remote.",
    );
  }
  return window.__HOST_SERVICES__;
}
