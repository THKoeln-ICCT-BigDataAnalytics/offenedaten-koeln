import { useState } from "react";
import { openOriginal, originalLinks } from "../services/linkService";

export default function Header({ onSearch, openHomePage, openDatasetsPage, pageName }) {
  const [moreOpen, setMoreOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const [headerQuery, setHeaderQuery] = useState("");

  async function submit(e) {
    e.preventDefault();
    const success = await onSearch(headerQuery);
    if (success) setHeaderQuery("");
  }

  return (
    <header className="top-header">
      <div className="header-inner">
        <button className="logo-button" onClick={openHomePage} aria-label="Offene Daten Köln Startseite">
          <img className="header-logo-img" src="https://offenedaten-koeln.de/themes/custom/dkan_bootstrap5/dist/bootstrap/img/logo.svg" alt="Offene Daten Köln" />
        </button>

        <nav className="desktop-nav">
          <div className="theme-menu-wrap">
            <button className={`theme-button ${themeOpen ? "active-theme" : ""}`} onClick={() => setThemeOpen((v) => !v)} aria-label="Farbschema auswählen">☀ ▾</button>
            {themeOpen && (
              <div className="theme-menu">
                <button type="button">Hell</button>
              </div>
            )}
          </div>
          <button className={pageName === "home" ? "active-nav" : ""} onClick={openHomePage}>Start</button>
          <button className={pageName === "datasets" ? "active-nav" : ""} onClick={openDatasetsPage}>Datensätze</button>
          <button onClick={() => openOriginal(originalLinks.series)}>Serien</button>
          <button onClick={() => openOriginal(originalLinks.publishers)}>Herausgeber</button>
          <button onClick={() => openOriginal(originalLinks.blog)}>Blog</button>

          <div className="more-menu-wrap">
            <button className={`more-button ${moreOpen ? "active-more" : ""}`} onClick={() => setMoreOpen((v) => !v)}>Mehr ▾</button>
            {moreOpen && (
              <div className="more-menu">
                <button onClick={() => openOriginal("https://offenedaten-koeln.de/api")}>API</button>
                <button onClick={() => openOriginal("https://offenedaten-koeln.de/about")}>Über</button>
                <button onClick={() => openOriginal("https://offenedaten-koeln.de/showroom")}>Apps</button>
                <button onClick={() => openOriginal("https://offenedaten-koeln.de/anfragen/daten")}>Daten anfragen</button>
                <button onClick={() => openOriginal("https://offenedaten-koeln.de/blog?f%5B0%5D=blog_kategorie%3A7")}>Anleitungen</button>
                <button onClick={() => openOriginal("https://offenedaten-koeln.de/blog?f%5B0%5D=blog_kategorie%3A16")}>Neuigkeiten</button>
              </div>
            )}
          </div>
        </nav>

        <form className="header-search" onSubmit={submit}>
          <input placeholder="Datensätze suchen" value={headerQuery} onChange={(e) => setHeaderQuery(e.target.value)} />
          <button type="submit">Suche</button>
        </form>

        <div className="mobile-header-actions">
          <button type="button" aria-label="Datensätze suchen" onClick={openDatasetsPage}>⌕</button>
          <button type="button" aria-label="Navigation umschalten">☰</button>
        </div>
      </div>
    </header>
  );
}
