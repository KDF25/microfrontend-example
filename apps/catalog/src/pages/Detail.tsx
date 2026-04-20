import { useParams, Navigate } from "react-router-dom";
import { getProductById } from "@/data/products";
import { formatPrice } from "@/lib/format";
import { getHostServices } from "@/host-services";

export function CatalogDetail() {
  const { id } = useParams<{ id: string }>();
  const product = id ? getProductById(id) : undefined;
  const { addToCart } = getHostServices();

  if (!product) return <Navigate to="/catalog" replace />;

  return (
    <div className="product-detail">
      <div className="product-detail__media">
        <img src={product.imageUrl} alt={product.title} />
      </div>
      <div>
        <h1 className="product-detail__title">{product.title}</h1>
        <div className="product-detail__meta">
          <span>★ {product.rating.toFixed(1)}</span>
          <span style={{ textTransform: "capitalize" }}>{product.category}</span>
          <span>{product.inStock ? "In stock" : "Out of stock"}</span>
        </div>
        <div className="product-detail__price">
          {formatPrice(product.priceCents, product.currency)}
        </div>
        <p className="product-detail__description">{product.description}</p>
        <div className="product-detail__actions">
          <button
            className="btn btn--primary btn--lg"
            disabled={!product.inStock}
            onClick={() => addToCart(product.id, 1)}
          >
            {product.inStock ? "Add to cart" : "Out of stock"}
          </button>
        </div>
      </div>
    </div>
  );
}
