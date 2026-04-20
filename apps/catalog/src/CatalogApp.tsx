import { Routes, Route } from "react-router-dom";
import { CatalogList } from "./pages/List";
import { CatalogDetail } from "./pages/Detail";

/**
 * The module exposed to the host via Module Federation.
 *
 * The host mounts this under `/catalog/*`, so internal routes use paths
 * RELATIVE to that mount point. react-router-dom v6 handles the nesting
 * automatically when parents use `/catalog/*` and children declare just
 * their tail ("/", ":id").
 */
export default function CatalogApp() {
  return (
    <Routes>
      <Route index element={<CatalogList />} />
      <Route path=":id" element={<CatalogDetail />} />
    </Routes>
  );
}
