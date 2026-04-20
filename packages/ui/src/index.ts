// Shared UI primitives live here.
//
// Rules of thumb:
//   - Only lift a component when TWO remotes actually need it.
//   - Keep the API tight: no feature-specific props.
//   - No domain imports (no auth, no cart, no product types).
//   - Style with design tokens, not app-specific classes.
//
// Starts empty. As you split the monolith, candidates for promotion here:
//     Button, Spinner, Skeleton, EmptyState, Chip.
//
// Avoid lifting Header/Navigation: those belong to the host shell.

export {};
