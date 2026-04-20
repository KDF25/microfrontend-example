import { Link } from "react-router-dom";
import type { Product } from "@/data/products";
import { formatPrice } from "@/lib/format";
import { getHostServices } from "@/host-services";

interface Props {
  product: Product;
}

export function ProductCard({ product }: Props) {
  // "Add to cart" goes through the host contract, not a shared store.
  const { addToCart } = getHostServices();

  return (
    <article className="product-card">
      <Link to={`/catalog/${product.id}`} className="product-card__media">
        <img src={product.imageUrl} alt={product.title} />
      </Link>
      <div className="product-card__body">
        <Link to={`/catalog/${product.id}`} className="product-card__title">
          {product.title}
        </Link>
        <div className="product-card__meta">
          <span className="product-card__price">
            {formatPrice(product.priceCents, product.currency)}
          </span>
          <span className="product-card__rating">★ {product.rating.toFixed(1)}</span>
        </div>
        <button
          className="btn btn--secondary btn--sm"
          disabled={!product.inStock}
          onClick={() => addToCart(product.id, 1)}
        >
          {product.inStock ? "Add to cart" : "Out of stock"}
        </button>
      </div>
    </article>
  );
}
