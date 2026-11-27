import { externalLinkProps, originalLinks, originalUrl } from "../services/linkService";

const serviceLinks = [
  { label: "Barrierefreiheit", path: "/barrierefreiheit" },
  { label: "Datenschutz", path: "/datenschutz" },
  { label: "Impressum", path: "/impressum" },
  { label: "Kontakt", path: "/form/kontakt" },
  { label: "Leichte Sprache", path: "/leichtesprache" },
  { label: "Nutzungsbedingungen", path: "/nutzungsbedingungen" },
];

export default function Footer({ openHomePage }) {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-col">
          <a
            className="footer-logo"
            href="#start"
            title="Startseite"
            onClick={(e) => {
              e.preventDefault();
              openHomePage();
            }}
          >
            <img className="logo" src={originalLinks.logo} alt="Offene Daten Köln" />
          </a>
          <a className="footer-logo" href="https://www.stadt-koeln.de/" title="Stadt Köln" {...externalLinkProps}>
            <img className="logo" src={originalLinks.cityLogo} alt="Stadt Köln" />
          </a>
        </div>

        <div className="footer-col">
          <nav aria-labelledby="footer-service-title">
            <h4 id="footer-service-title">Service</h4>
            <ul className="footer-links">
              {serviceLinks.map((link) => (
                <li key={link.path}>
                  <a href={originalUrl(link.path)} {...externalLinkProps}>{link.label}</a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="footer-col">
          <ul className="footer-links">
            <li>
              <a href={originalUrl("/user/login")} {...externalLinkProps}>Anmelden</a>
            </li>
          </ul>
          <a className="footer-rss" href={originalUrl("/datasets.rss")} aria-label="RSS-Feed der Datensätze" {...externalLinkProps}>
            <i className="bi bi-rss" aria-hidden="true"></i>
          </a>
        </div>
      </div>
    </footer>
  );
}
