import { lazy } from "react";
import { RemoteBoundary } from "@/components/RemoteBoundary";

// ts-loader needs to know the remote exists; its types are declared in
// `src/remotes/remotes.d.ts`.
const CatalogApp = lazy(() => import("catalog/CatalogApp"));

export function CatalogRemote() {
  return (
    <RemoteBoundary name="catalog">
      <CatalogApp />
    </RemoteBoundary>
  );
}
