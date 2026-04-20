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
        "before rendering the account remote.",
    );
  }
  return window.__HOST_SERVICES__;
}
