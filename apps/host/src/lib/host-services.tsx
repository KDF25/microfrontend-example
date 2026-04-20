import { createContext, useContext, useEffect, useMemo, type ReactNode } from "react";
import { useCart } from "./cart-store";
import { getSession } from "./auth";
import type { Session, ProductId } from "@/types";

/**
 * HostServices is the public contract the host exposes to every remote.
 *
 * - Host-local consumers (Header/UserMenu/CartIndicator) use `useHostServices()`.
 * - Remote consumers read `window.__HOST_SERVICES__`, which is a deliberately
 *   low-tech injection point. It avoids forcing remotes to import React
 *   context that crosses MF boundaries, and keeps the contract serializable.
 *
 * Both surfaces must be kept in sync — the Provider writes to both on every
 * render (see effect below).
 */
export interface HostServices {
  session: Session;
  addToCart: (productId: ProductId, quantity?: number) => void;
  cartCount: number;
}

declare global {
  interface Window {
    __HOST_SERVICES__?: HostServices;
  }
}

const HostServicesContext = createContext<HostServices | null>(null);

export function HostServicesProvider({ children }: { children: ReactNode }) {
  const addToCart = useCart((s) => s.add);
  const cartCount = useCart((s) => s.lines.reduce((sum, l) => sum + l.quantity, 0));

  const services = useMemo<HostServices>(
    () => ({ session: getSession(), addToCart, cartCount }),
    [addToCart, cartCount],
  );

  useEffect(() => {
    window.__HOST_SERVICES__ = services;
  }, [services]);

  // Set synchronously on first render too, so a remote that reads during its
  // own render (before effects flush) still sees the injected value.
  if (typeof window !== "undefined") {
    window.__HOST_SERVICES__ = services;
  }

  return (
    <HostServicesContext.Provider value={services}>{children}</HostServicesContext.Provider>
  );
}

export function useHostServices(): HostServices {
  const ctx = useContext(HostServicesContext);
  if (!ctx) {
    throw new Error(
      "useHostServices() called outside HostServicesProvider. " +
        "If this fires from a remote, the host is not providing services — " +
        "check that the remote is mounted inside <HostServicesProvider>.",
    );
  }
  return ctx;
}
