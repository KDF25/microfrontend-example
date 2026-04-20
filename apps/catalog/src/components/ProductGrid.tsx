import type { Product } from "@/data/products";
import { ProductCard } from "./ProductCard";

interface Props {
  products: Product[];
}

export function ProductGrid({ products }: Props) {
  if (products.length === 0) {
    return <div className="empty-state">No products match your filters.</div>;
  }
  return (
    <div className="product-grid">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
