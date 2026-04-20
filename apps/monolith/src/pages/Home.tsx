import { Link } from "react-router-dom";
import { ProductGrid } from "@/components/ProductGrid";
import { Button } from "@/components/Button";
import { getAllProducts } from "@/lib/data/products";

export function HomePage() {
  const featured = getAllProducts().filter((p) => p.inStock).slice(0, 4);
  return (
    <>
      <section className="hero">
        <h1 className="hero__title">Workspace essentials, without the clutter.</h1>
        <p className="hero__sub">
          A curated set of tools, bags, and home goods. Everything here is
          hand-picked for people who care about the details.
        </p>
        <div className="hero__actions">
          <Link to="/catalog">
            <Button variant="primary" size="lg">Browse catalog</Button>
          </Link>
          <Link to="/account">
            <Button variant="secondary" size="lg">Your account</Button>
          </Link>
        </div>
      </section>
      <h2 className="section-title">Featured</h2>
      <ProductGrid products={featured} />
    </>
  );
}
