import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CatalogApp from "./CatalogApp";

// Standalone entry. Only used when the catalog remote is served by itself
// (e.g. `pnpm --filter catalog dev`). When loaded by the host, the host
// imports ./CatalogApp directly and this file is never executed.
const StandaloneHostServices = {
  session: {
    user: { id: "u-dev", email: "dev@acme.test", name: "Dev User", tier: "plus" as const },
    isAuthenticated: true,
  },
  addToCart: (id: string, qty = 1) => {
    // eslint-disable-next-line no-console
    console.log(`[standalone] addToCart(${id}, ${qty})`);
  },
  cartCount: 0,
};

(window as unknown as { __HOST_SERVICES__: typeof StandaloneHostServices }).__HOST_SERVICES__ =
  StandaloneHostServices;

const container = document.getElementById("root");
if (!container) throw new Error("#root not found");
createRoot(container).render(
  <BrowserRouter>
    <Routes>
      <Route path="/*" element={<CatalogApp />} />
    </Routes>
  </BrowserRouter>,
);
