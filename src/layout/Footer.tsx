import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p>© 2025 Stegvis. Alla rättigheter förbehållna.</p>
      <div className={styles.footerLinks}>
        <a href="/about">Om oss</a>
        <a href="/contact">Kontakt</a>
        <a href="/privacy">Integritetspolicy</a>
      </div>
    </footer>
  );
}
