// Async boundary for Module Federation. Without this, React is evaluated
// before shared-deps negotiation completes and we end up with duplicate copies.
import("./bootstrap");
