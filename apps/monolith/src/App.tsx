import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HomePage } from "@/pages/Home";
import { CatalogList } from "@/pages/catalog/List";
import { CatalogDetail } from "@/pages/catalog/Detail";
import { AccountLayout } from "@/pages/account/AccountLayout";
import { AccountOverview } from "@/pages/account/Overview";
import { Profile } from "@/pages/account/Profile";
import { Orders } from "@/pages/account/Orders";
import { Checkout } from "@/pages/Checkout";

export function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Header />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/catalog" element={<CatalogList />} />
            <Route path="/catalog/:id" element={<CatalogDetail />} />
            <Route path="/account" element={<AccountLayout />}>
              <Route index element={<AccountOverview />} />
              <Route path="profile" element={<Profile />} />
              <Route path="orders" element={<Orders />} />
            </Route>
            <Route path="/checkout" element={<Checkout />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
