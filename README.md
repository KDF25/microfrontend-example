# Acme Shop — microfrontends sandbox

An educational monorepo for middle/senior frontend engineers. A small but
production-shaped React e-commerce app ships as a monolith on purpose. Your
job is to split it into microfrontends using **Webpack 5 Module Federation**
and deploy each one independently to **AWS S3 + CloudFront**.

---

## Legend

You've joined **Acme Shop**, a 3-year-old team whose single React SPA now
powers the whole public site: catalog, account, checkout. Three teams grew
around it — **Catalog**, **Account**, **Checkout** — and the monolith has
become a bottleneck:

- release train everyone has to ride, even for one-line changes;
- lint / test / build run across the entire app for any PR;
- a catalog bugfix blocks an account experiment;
- the shared `Header` is rewritten four times a quarter by different people.

Leadership has asked you to migrate. The contract:

1. The three teams must deploy **independently**, at their own cadence,
   without talking to each other.
2. The URL layout and UX stay the same — the user cannot tell anything
   changed.
3. One codebase, one monorepo, but independent build and release for each
   microfrontend.

---

## What's in the repo

```
mf-infra/
├── apps/
│   ├── monolith/       ← working React + Webpack SPA (START HERE)
│   ├── host/           ← target: shell, loads remotes via Module Federation
│   ├── catalog/        ← target: catalog remote (exposes ./CatalogApp)
│   └── account/        ← target: account remote (exposes ./AccountApp)
├── packages/
│   ├── types/          ← shared cross-context contracts (HostServices, etc.)
│   ├── ui/             ← shared UI primitives (empty — lift when needed)
│   └── config/         ← shared runtime config helpers
├── infra/              ← Terraform: S3 + CloudFront per microfrontend, CI role, SSM
├── .github/workflows/  ← one pipeline per app + a reusable build+sync job
├── STUDENT_TASK.md     ← the assignment
├── MENTOR_NOTES.md     ← expected solution, red flags, defense questions
└── architecture.md     ← mermaid diagrams: current vs target
```

---

## Architectural choice: Webpack 5 Module Federation

The host loads two remotes — `catalog` and `account` — by fetching each
remote's `remoteEntry.js` manifest at runtime and mounting their exposed
React trees. Shared dependencies (`react`, `react-dom`, `react-router-dom`)
are de-duplicated at load time via MF's `shared` config.

Why this over the alternatives:

| Option | Why not here |
|---|---|
| **iframes** | Real isolation, but lose routing, shared styles, keyboard focus, and SSO. Heavy. |
| **Edge composition (SSI / ESI / Cloudflare Workers)** | Needs a smart proxy. Great at scale, wrong shape for learning. |
| **Next.js Multi-Zones** | Requires Next.js everywhere and gives you *page*-level splits, not component-level. Our teams want to swap sub-trees, not whole pages. |
| **Module Federation** ✅ | Host and remotes are plain React apps. `ModuleFederationPlugin` ships with Webpack 5 — zero extra runtimes. Independent deploys are natural: each remote publishes its own `remoteEntry.js` to its own CDN. |

Trade-offs you accept:
- **Shared deps must be pinned carefully.** Mismatched React versions = dual
  React trees at runtime; hooks blow up. We pin to exact versions and flag
  `singleton: true`.
- **Host must handle remote load failures.** Network/CDN hiccups can't crash
  the whole shell — see `apps/host/src/components/RemoteBoundary.tsx`.
- **CORS is mandatory.** The host's origin fetches `remoteEntry.js` from
  each remote's CDN domain, which needs explicit `Access-Control-Allow-Origin`.

---

## Running the monolith (today's state)

```bash
pnpm install
pnpm --filter monolith dev
# → http://localhost:3000
```

You get: home → catalog list → product detail → cart → checkout, plus an
account area with mocked profile and orders. The monolith has intentional
smells — see `STUDENT_TASK.md §5`.

## Running the microfrontends (target state)

Each app stands up on its own port:

```bash
pnpm --filter catalog dev   # :3001  exposes remoteEntry.js
pnpm --filter account dev   # :3002  exposes remoteEntry.js
pnpm --filter host dev      # :3000  loads both — open this one
```

or all at once:

```bash
pnpm dev:all
```

Remotes can be run in isolation (`pnpm --filter catalog dev`) without the
host — each remote has a standalone bootstrap that renders its routes
against a mocked `HostServices`. Handy when iterating on a remote.

---

## Deploying

Each microfrontend deploys to its own S3 bucket behind its own CloudFront
distribution. Pushing to `main` triggers the workflow matching the changed
paths; only that workflow runs, only that bucket+distribution updates.

1. Apply `infra/envs/dev` once (mentor job) — see `infra/docs/bootstrap.md`.
2. Wire Terraform outputs into GitHub repo secrets/vars (see `infra/README.md`).
3. Push to `main` — path-based triggers do the rest.

---

## Scope by role

- **Strong middle**: finish Part 1 (decomposition), ship one remote to dev.
- **Senior**: both parts, cover trade-offs, rollback, and version-skew on
  defense.

Expected time: **6–12 hours**, splittable across 2–3 sessions.
