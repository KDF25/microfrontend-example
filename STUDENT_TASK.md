# Student assignment — Acme Shop microfrontends

> Read `README.md` first for the project legend.

## 1. Context

Acme Shop is a small e-commerce web app built as a **React SPA with Webpack
5**. It currently lives as a single deployable monolith at `apps/monolith`.
Three product teams contribute to it:

- **Catalog** — product list, filters, product detail;
- **Account** — user profile, orders;
- **Checkout** — cart + order placement.

## 2. Business goal

Leadership wants the teams to ship independently. Specifically:

- one team's hotfix must not be blocked by another team's release;
- CI time on a trivial PR must not scale with the size of the whole app;
- UX must remain identical to end-users (no layout jumps, no auth loss).

## 3. Problem with the current architecture

The monolith has intentional smells that block decomposition. Find them and
fix them on the way out:

| Smell | File(s) |
|---|---|
| All types in one file, domains mixed | `apps/monolith/src/types/index.ts` |
| `Header` pulls from auth, cart, feature flags at once | `apps/monolith/src/components/Header.tsx` |
| `Navigation` hard-codes every domain's routes | `apps/monolith/src/components/Navigation.tsx` |
| `ProductCard` (catalog) mutates cart directly | `apps/monolith/src/components/ProductCard.tsx` |
| Flat feature-flag bag across domains | `apps/monolith/src/lib/features.ts` |
| `Checkout` reads product prices from catalog's data module | `apps/monolith/src/pages/Checkout.tsx` |
| Single Dockerfile, single CI pipeline, single deploy target | `apps/monolith/Dockerfile`, `.github/workflows/monolith.yml` |

---

## 4. The task — in two parts

### Part 1 — Microfrontends (code)

You must:

1. **Identify bounded contexts.** Justify in `architecture.md` which domain
   owns what. Defend where Checkout lives — host, catalog, or its own
   remote.
2. **Separate host from feature remotes.** The host owns `/`, the shell
   (header/footer/navigation), auth, cart store, and runtime config. It
   does NOT own product data or order rendering.
3. **Expose remotes with Module Federation.** Each remote publishes a
   `remoteEntry.js`:
   - `catalog` at `:3001`, exposes `./CatalogApp`.
   - `account` at `:3002`, exposes `./AccountApp`.
   - Both `shared` react, react-dom, react-router-dom as singletons.
4. **Define the host↔remote contract.** The host publishes a `HostServices`
   object (session, `addToCart`, `cartCount`) and injects it onto
   `window.__HOST_SERVICES__`. Remotes read it via a `getHostServices()`
   helper. Document this contract in `architecture.md §Communication`.
5. **Handle remote failure.** If a remote's `remoteEntry.js` 404s, the host
   must show a local fallback, not crash the whole shell. Use
   `React.Suspense` + an error boundary.
6. **Carve shared code** into `packages/`:
   - `@mf/types` — only contracts that cross bounded contexts (HostServices,
     SharedUser, RemoteManifest). No domain internals.
   - `@mf/ui` — design-system primitives, lifted ONLY when ≥2 remotes use
     the same component.
   - `@mf/config` — runtime config types and readers.
7. **Route correctly.**
   - Host serves `/` and the shell.
   - `/catalog/*` renders the catalog remote (its internal routes are
     relative).
   - `/account/*` renders the account remote.
8. **Run all three locally.** `pnpm dev:all` brings up host, catalog,
   account. `http://localhost:3000/catalog/p-001` renders the detail page
   from the catalog remote, with the host's shell still around it.
9. **Preserve UX.** Navigating between `/`, `/catalog`, `/account` must not
   flash the shell, drop the session, or reload the page.

### Part 2 — AWS + CI/CD

You must:

1. **Deploy each microfrontend.** Each gets its own S3 bucket + CloudFront
   distribution. Terraform is in `infra/envs/dev`.
2. **Independent deployments.** A push that only changes `apps/catalog/**`
   must deploy **only** the catalog bucket+distribution. Verify by
   inspecting which workflow runs.
3. **Path-based CI triggers.** Already scaffolded — confirm they fire
   correctly and explain what each `paths:` block does.
4. **Cache policy.**
   - Hashed chunk files: `Cache-Control: public, max-age=31536000, immutable`.
   - `index.html`, `remoteEntry.js`: `Cache-Control: no-cache`.
   - Explain *why*: if `remoteEntry.js` gets cached at the edge, a fresh
     host can load stale chunks that no longer exist on S3.
5. **CORS.** The host (on its domain) fetches `remoteEntry.js` from each
   remote's CloudFront domain. Remotes must set
   `Access-Control-Allow-Origin`. In prod, scope the allowlist to the
   host's domain, not `*`.
6. **Two environments.**
   - `dev` — auto-deploys on push to `main`.
   - `prod` — manual `workflow_dispatch` only, gated by a GitHub
     Environment with a required reviewer.
7. **Config without secrets.**
   - Non-secret shared config in SSM Parameter Store under `/mf/<env>/*`
     (remote URLs, feature flags). Terraform provisions it.
   - GitHub secrets only for AWS role ARNs. No long-lived AWS keys.
8. **Rollback strategy.** Document and demo one of:
   - Redeploy a prior git SHA via `workflow_dispatch` → the pipeline
     rebuilds from that commit and syncs to S3.
   - S3 object versioning: the bucket keeps prior versions; restore the
     previous `index.html` + chunk objects.
   - Explain why `aws s3 sync --delete` is safe here (new deploy uploads
     new chunks before `index.html` is flipped).
9. **Service discovery.** Answer in `architecture.md`: how does the host
   learn the URL of `catalog`? Today it's baked in at build time via
   `CATALOG_URL`. What changes if you want to rotate the catalog domain
   without redeploying the host? (See MENTOR_NOTES.md for the dynamic-
   remote approach.)

---

## 5. Acceptance criteria

Part 1 passes when:

- [ ] `pnpm dev:all` starts three processes; the full user journey works.
- [ ] `:3000/` is served by the host.
- [ ] `:3000/catalog`, `:3000/catalog/p-001` are served by the catalog
      remote (visible as `catalog/remoteEntry.js` in DevTools → Network).
- [ ] `:3000/account`, `:3000/account/orders` served by the account remote.
- [ ] Adding to cart from the catalog remote updates the header's cart
      counter (host-owned) without a reload.
- [ ] Stopping the catalog dev server and reloading `/catalog` shows the
      host's remote-failure fallback, NOT a blank page or crash.
- [ ] `packages/ui` contains at most 5 components, each used by ≥2 apps.
      (It can be empty — that's fine.)
- [ ] No remote imports from another remote.
- [ ] Shared React versions are de-duplicated (check DevTools → Components
      — only one React instance).

Part 2 passes when:

- [ ] `terraform apply` in `infra/envs/dev` succeeds from a clean state.
- [ ] Hitting the host's CloudFront domain renders the home page.
- [ ] Navigating to `/catalog/p-001` fetches `remoteEntry.js` from the
      catalog distribution and renders the detail page.
- [ ] A commit that only edits `apps/catalog/**` runs only the `catalog`
      workflow; only the catalog bucket gets new objects.
- [ ] Uploading a broken catalog build and rolling back to the previous
      SHA restores the site.
- [ ] Prod deploy is gated behind a manual approval.

## 6. Non-functional requirements

- Type-safe: `pnpm -r typecheck` clean.
- Lint-clean: `pnpm -r lint` clean.
- Each app has at least 2 meaningful tests.
- Every `Dockerfile` builds.
- No AWS credentials in the repo.

## 7. Deliverables

A PR with:

1. Code split per the rules above.
2. Updated `architecture.md` with your host↔remote contract, module
   federation diagram, and a paragraph on "what I'd do differently in a
   real 50-dev org".
3. A ~5-min recording (or section in the PR description) showing:
   - `pnpm dev:all` running the full journey;
   - a change in `apps/catalog` triggering only the catalog pipeline;
   - a rollback demo in dev.

## 8. Hints

- Start by sketching the architecture on paper. What does the header know?
  What does each remote *not* know?
- Migrate **one** remote first. Ship catalog end-to-end before you touch
  account. Ship-of-Theseus, not big-bang.
- Keep the monolith running while you migrate — fallback and reference.
- The host can "fake" auth in dev by reading a hard-coded user. Don't spend
  energy on a real auth service.
- When a remote's chunks 404, it's almost always a `publicPath` problem.
  DevTools → Network → look at the URL the failing chunk is being fetched
  from. In prod, `publicPath` must be the remote's absolute CloudFront URL.
- For shared UI, the rule is "two apps use it", not "it looks reusable".
- Shared-deps version mismatches are silent until runtime. If hooks blow
  up with "Invalid hook call", you have two React copies.

## 9. Common mistakes

- **Over-sharing.** Dumping every type into `@mf/types` rebuilds the
  monolith inside `packages/`.
- **Leaky host.** Putting catalog filter state in the host because "it
  shows in the URL". The URL is not the host's — owners of `/catalog`
  own its query string.
- **Two cart stores.** If the cart lives in `zustand` in the host AND a
  remote, they diverge the moment a remote updates its copy. The cart has
  one owner; other apps ask the owner to mutate it.
- **Forgetting `publicPath`.** Without it in prod, the host tries to fetch
  chunks from its own origin and 404s.
- **CI that builds everything.** If every PR rebuilds all three apps,
  `paths:` filters are wrong.
- **Cached `remoteEntry.js`.** If CloudFront caches it, users load a
  remote's old manifest against its new chunks — broken app. Must be
  `Cache-Control: no-cache`.

## 10. Trade-offs to discuss on defense

Be ready to explain:

1. Why Module Federation and not iframes / Multi-Zones / edge composition?
   What would change your mind?
2. Where did you put Checkout, and why?
3. What's the failure mode if catalog is down? What does the host show?
4. How do you prevent a `@mf/types` breaking change (HostServices) from
   shipping a broken host against old remotes?
5. If the company moved to a `@mf/ui` design system with 30 components
   used by all remotes, does Module Federation still make sense? Why or
   why not?
6. S3 object versioning vs git-SHA redeploy — which is a better rollback
   mechanism, and when?
