// Catalog owns its domain data. This is the boundary — no other app should
// import from here. In a real system this would be a REST/GraphQL call to
// the catalog service; mocking it keeps the sandbox runnable offline.

export interface Product {
  id: string;
  slug: string;
  title: string;
  description: string;
  priceCents: number;
  currency: "USD" | "EUR";
  category: "lighting" | "bags" | "audio" | "home" | "peripherals" | "office";
  rating: number;
  imageUrl: string;
  inStock: boolean;
}

export const PRODUCTS: Product[] = [
  {
    id: "p-001",
    slug: "aurora-desk-lamp",
    title: "Aurora Desk Lamp",
    description: "Warm-tone LED desk lamp with adjustable arm and a USB-C charging port.",
    priceCents: 7900,
    currency: "USD",
    category: "lighting",
    inStock: true,
    rating: 4.6,
    imageUrl: "/img/aurora-desk-lamp.svg",
  },
  {
    id: "p-002",
    slug: "nomad-backpack-28l",
    title: "Nomad Backpack 28L",
    description: "Weather-resistant commuter backpack with padded laptop sleeve for up to 16\".",
    priceCents: 12900,
    currency: "USD",
    category: "bags",
    inStock: true,
    rating: 4.8,
    imageUrl: "/img/nomad-backpack.svg",
  },
  {
    id: "p-003",
    slug: "pulse-wireless-earbuds",
    title: "Pulse Wireless Earbuds",
    description: "Low-latency Bluetooth earbuds with active noise cancellation.",
    priceCents: 9900,
    currency: "USD",
    category: "audio",
    inStock: true,
    rating: 4.3,
    imageUrl: "/img/pulse-earbuds.svg",
  },
  {
    id: "p-004",
    slug: "terra-ceramic-mug",
    title: "Terra Ceramic Mug",
    description: "Handmade 350ml ceramic mug, microwave and dishwasher safe.",
    priceCents: 1900,
    currency: "USD",
    category: "home",
    inStock: true,
    rating: 4.9,
    imageUrl: "/img/terra-mug.svg",
  },
  {
    id: "p-005",
    slug: "forge-mechanical-keyboard",
    title: "Forge Mechanical Keyboard",
    description: "75% layout keyboard with hot-swappable switches and RGB lighting.",
    priceCents: 15900,
    currency: "USD",
    category: "peripherals",
    inStock: false,
    rating: 4.5,
    imageUrl: "/img/forge-keyboard.svg",
  },
  {
    id: "p-006",
    slug: "summit-water-bottle",
    title: "Summit Insulated Bottle",
    description: "Keeps drinks cold for 24h or hot for 12h. 750ml capacity.",
    priceCents: 3400,
    currency: "USD",
    category: "home",
    inStock: true,
    rating: 4.7,
    imageUrl: "/img/summit-bottle.svg",
  },
  {
    id: "p-007",
    slug: "glide-laptop-stand",
    title: "Glide Laptop Stand",
    description: "Aluminum foldable stand with 6 ergonomic height positions.",
    priceCents: 4900,
    currency: "USD",
    category: "peripherals",
    inStock: true,
    rating: 4.4,
    imageUrl: "/img/glide-stand.svg",
  },
  {
    id: "p-008",
    slug: "orbit-desk-mat",
    title: "Orbit Desk Mat",
    description: "Extra-large desk mat with stitched edges and non-slip base.",
    priceCents: 2900,
    currency: "USD",
    category: "office",
    inStock: true,
    rating: 4.2,
    imageUrl: "/img/orbit-mat.svg",
  },
];

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function getProductsByCategory(
  category: Product["category"] | "all",
): Product[] {
  if (category === "all") return PRODUCTS;
  return PRODUCTS.filter((p) => p.category === category);
}
