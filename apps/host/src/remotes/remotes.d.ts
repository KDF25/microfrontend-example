// Ambient module declarations for Module Federation remotes. Webpack rewrites
// these imports at runtime, so TypeScript just needs to know the modules exist.
declare module "catalog/CatalogApp" {
  const CatalogApp: React.ComponentType;
  export default CatalogApp;
}

declare module "account/AccountApp" {
  const AccountApp: React.ComponentType;
  export default AccountApp;
}
