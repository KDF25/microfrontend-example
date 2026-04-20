import { Link, useParams, Navigate } from "react-router-dom";
import { Button } from "@/components/Button";
import { useCart } from "@/lib/cart-store";
import { formatPrice } from "@/lib/format";
import { getProductById } from "@/lib/data/products";

export function CatalogDetail() {
  const { id = "" } = useParams();
  const add = useCart((s) => s.add);
  const product = getProductById(id);
  if (!product) return <Navigate to="/catalog" replace />;

  return (
    <article className="product-detail">
      <div className="product-detail__media">
        <img src={product.imageUrl} alt={product.title} />
      </div>
      <div>
        <nav style={{ marginBottom: 12, fontSize: 13, color: "var(--text-muted)" }}>
          <Link to="/catalog">← Back to catalog</Link>
        </nav>
        <h1 className="product-detail__title">{product.title}</h1>
        <div className="product-detail__meta">
          <span>Category: {product.category}</span>
          <span>★ {product.rating.toFixed(1)}</span>
          <span>{product.inStock ? "In stock" : "Out of stock"}</span>
        </div>
        <p className="product-detail__description">{product.description}</p>
        <div className="product-detail__price">
          {formatPrice(product.priceCents, product.currency)}
        </div>
        <div className="product-detail__actions">
          <Button
            variant="primary"
            size="lg"
            disabled={!product.inStock}
            onClick={() => add(product.id, 1)}
          >
            Add to cart
          </Button>
          <Link to="/checkout">
            <Button variant="secondary" size="lg">Go to checkout</Button>
          </Link>
        </div>
      </div>
    </article>
  );
}
