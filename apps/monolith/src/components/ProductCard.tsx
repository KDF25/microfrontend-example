import { Link } from "react-router-dom";
import { Button } from "./Button";
import { useCart } from "@/lib/cart-store";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/types";

// ---------------------------------------------------------------------------
// Intentional smell: ProductCard belongs to the catalog domain but calls into
// the cart store directly. After decomposition the catalog remote shouldn't
// import checkout internals — it should emit an "add to cart" event or call
// a host-provided action injected through a shared context.
// ---------------------------------------------------------------------------

export function ProductCard({ product }: { product: Product }) {
  const add = useCart((s) => s.add);
  return (
    <article className="product-card">
      <Link to={`/catalog/${product.id}`} className="product-card__media">
        <img src={product.imageUrl} alt={product.title} loading="lazy" />
      </Link>
      <div className="product-card__body">
        <Link to={`/catalog/${product.id}`} className="product-card__title">
          {product.title}
        </Link>
        <div className="product-card__meta">
          <span className="product-card__price">
            {formatPrice(product.priceCents, product.currency)}
          </span>
          <span className="product-card__rating" aria-label={`Rating ${product.rating}`}>
            ★ {product.rating.toFixed(1)}
          </span>
        </div>
        <Button
          variant="primary"
          size="sm"
          disabled={!product.inStock}
          onClick={() => add(product.id, 1)}
        >
          {product.inStock ? "Add to cart" : "Out of stock"}
        </Button>
      </div>
    </article>
  );
}
