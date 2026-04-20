export function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <span>© {new Date().getFullYear()} Acme Shop</span>
        <span>Demo — payments are mocked.</span>
      </div>
    </footer>
  );
}
