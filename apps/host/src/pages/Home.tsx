import { Link } from "react-router-dom";
import { Button } from "@/components/Button";

export function HomePage() {
  return (
    <>
      <section className="hero">
        <h1 className="hero__title">Shop the essentials.</h1>
        <p className="hero__sub">
          Curated gear for home, office, and everywhere in between.
          Free shipping on orders over $50.
        </p>
        <div className="hero__actions">
          <Link to="/catalog">
            <Button variant="primary" size="lg">
              Browse catalog
            </Button>
          </Link>
          <Link to="/account">
            <Button variant="ghost" size="lg">
              My account
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
