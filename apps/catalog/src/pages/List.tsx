import { useSearchParams } from "react-router-dom";
import { getProductsByCategory, type Product } from "@/data/products";
import { ProductGrid } from "@/components/ProductGrid";

const CATEGORIES: Array<{ id: Product["category"] | "all"; label: string }> = [
  { id: "all", label: "All" },
  { id: "lighting", label: "Lighting" },
  { id: "bags", label: "Bags" },
  { id: "audio", label: "Audio" },
  { id: "home", label: "Home" },
  { id: "peripherals", label: "Peripherals" },
  { id: "office", label: "Office" },
];

export function CatalogList() {
  const [params, setParams] = useSearchParams();
  const active = (params.get("category") as Product["category"] | "all") || "all";
  const products = getProductsByCategory(active);

  return (
    <>
      <h1 className="section-title" style={{ marginTop: 0 }}>Catalog</h1>
      <div className="filter-bar">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            className={
              "filter-bar__chip" + (active === cat.id ? " filter-bar__chip--active" : "")
            }
            onClick={() => {
              const next = new URLSearchParams(params);
              if (cat.id === "all") next.delete("category");
              else next.set("category", cat.id);
              setParams(next);
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>
      <ProductGrid products={products} />
    </>
  );
}
