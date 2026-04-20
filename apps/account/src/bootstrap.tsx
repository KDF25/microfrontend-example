import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AccountApp from "./AccountApp";

const StandaloneHostServices = {
  session: {
    user: { id: "u-dev", email: "dev@acme.test", name: "Dev User", tier: "plus" as const },
    isAuthenticated: true,
  },
  addToCart: () => undefined,
  cartCount: 0,
};

(window as unknown as { __HOST_SERVICES__: typeof StandaloneHostServices }).__HOST_SERVICES__ =
  StandaloneHostServices;

const container = document.getElementById("root");
if (!container) throw new Error("#root not found");
createRoot(container).render(
  <BrowserRouter>
    <Routes>
      <Route path="/*" element={<AccountApp />} />
    </Routes>
  </BrowserRouter>,
);
