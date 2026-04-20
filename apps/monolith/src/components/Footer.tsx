export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="footer__inner">
        <span>© {year} Meridian Store — educational sandbox</span>
        <span className="footer__meta">build: {process.env.APP_VERSION ?? "dev"}</span>
      </div>
    </footer>
  );
}
