import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HostServicesProvider } from "@/lib/host-services";
import { HomePage } from "@/pages/Home";
import { Checkout } from "@/pages/Checkout";
import { CatalogRemote } from "@/remotes/CatalogRemote";
import { AccountRemote } from "@/remotes/AccountRemote";

export function App() {
  return (
    <HostServicesProvider>
      <BrowserRouter>
        <div className="app-shell">
          <Header />
          <main className="app-main">
            <Routes>
              <Route path="/" element={<HomePage />} />
              {/*
                Remotes own their own inner routing. The host delegates
                everything under /catalog/* and /account/* to the remote's
                App component, which uses react-router's outlet context to
                compose its nested routes.
              */}
              <Route path="/catalog/*" element={<CatalogRemote />} />
              <Route path="/account/*" element={<AccountRemote />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </HostServicesProvider>
  );
}
