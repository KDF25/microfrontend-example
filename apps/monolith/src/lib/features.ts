import type { FeatureFlags } from "@/types";

// ---------------------------------------------------------------------------
// Intentional smell: flat feature flag bag with flags from every domain mixed
// together. When you split into microfrontends decide who owns which flag and
// how the host exposes the shared ones to remotes.
// ---------------------------------------------------------------------------

function readBool(envValue: string | undefined, fallback: boolean): boolean {
  if (envValue === undefined) return fallback;
  return envValue === "true" || envValue === "1";
}

export function getFeatureFlags(): FeatureFlags {
  return {
    newCart: readBool(process.env.FEATURE_NEW_CART, true),
    promoBanner: readBool(process.env.FEATURE_PROMO_BANNER, false),
    ordersExport: readBool(process.env.FEATURE_ORDERS_EXPORT, false),
  };
}

export const isEnabled = <K extends keyof FeatureFlags>(flag: K): boolean =>
  getFeatureFlags()[flag];
