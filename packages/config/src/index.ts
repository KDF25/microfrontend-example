// Shared runtime config contract.
//
// The host reads the canonical config (build-time env vars or a runtime
// manifest) and exposes a narrow subset to remotes — either by injecting it
// onto window.__HOST_SERVICES__ or by fetching it from an endpoint the host
// owns. Do NOT leak every env var from the host to every remote.

export interface RuntimeConfig {
  appVersion: string;
  environment: "dev" | "prod";
  features: {
    promoBanner: boolean;
  };
  remotes: {
    catalogUrl: string;
    accountUrl: string;
  };
}

export function readBool(value: string | undefined, fallback = false): boolean {
  if (value === undefined) return fallback;
  return value === "true" || value === "1";
}
