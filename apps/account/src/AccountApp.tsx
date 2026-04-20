import { Routes, Route } from "react-router-dom";
import { AccountLayout } from "./pages/AccountLayout";
import { AccountOverview } from "./pages/Overview";
import { Profile } from "./pages/Profile";
import { Orders } from "./pages/Orders";

// Mounted by the host under /account/*. Internal routes are relative.
export default function AccountApp() {
  return (
    <Routes>
      <Route element={<AccountLayout />}>
        <Route index element={<AccountOverview />} />
        <Route path="profile" element={<Profile />} />
        <Route path="orders" element={<Orders />} />
      </Route>
    </Routes>
  );
}
