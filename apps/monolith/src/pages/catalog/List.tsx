import { useSearchParams, Link } from "react-router-dom";
import { ProductGrid } from "@/components/ProductGrid";
import { getAllProducts } from "@/lib/data/products";

export function CatalogList() {
  const [params] = useSearchParams();
  const all = getAllProducts();
  const categories = Array.from(new Set(all.map((p) => p.category))).sort();
  const active = params.get("category") ?? "all";
  const filtered = active === "all" ? all : all.filter((p) => p.category === active);

  return (
    <>
      <h1 className="section-title" style={{ marginTop: 0 }}>Catalog</h1>
      <div className="filter-bar" role="tablist">
        <Link
          to="/catalog"
          className={`filter-bar__chip ${active === "all" ? "filter-bar__chip--active" : ""}`.trim()}
        >
          All
        </Link>
        {categories.map((c) => (
          <Link
            key={c}
            to={`/catalog?category=${c}`}
            className={`filter-bar__chip ${active === c ? "filter-bar__chip--active" : ""}`.trim()}
          >
            {c}
          </Link>
        ))}
      </div>
      <ProductGrid products={filtered} />
    </>
  );
}
