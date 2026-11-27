import { useState } from "react";

const categoryLinks = [
  { title: "Bevölkerung und Gesellschaft", iconLabel: "people fill", iconPath: "M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5.784 6A2.24 2.24 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.3 6.3 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5" },
  { title: "Bildung, Kultur und Sport", iconLabel: "mortarboard fill", iconPath: "M8.211 2.047a.5.5 0 0 0-.422 0l-7.5 3.5a.5.5 0 0 0 .025.917l7.5 3a.5.5 0 0 0 .372 0L14 7.14V13a1 1 0 0 0-1 1v2h3v-2a1 1 0 0 0-1-1V6.739l.686-.275a.5.5 0 0 0 .025-.917z" },
  { title: "Energie", iconLabel: "lightning charge fill", iconPath: "M11.251.068a.5.5 0 0 1 .227.58L9.677 6.5H13a.5.5 0 0 1 .364.843l-8 8.5a.5.5 0 0 1-.842-.49L6.323 9.5H3a.5.5 0 0 1-.364-.843l8-8.5a.5.5 0 0 1 .615-.09z" },
  { title: "Gesundheit", iconLabel: "hospital fill", iconPath: "M6 0a1 1 0 0 0-1 1v1a1 1 0 0 0-1 1v4H1a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h6v-2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5V16h6a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1h-3V3a1 1 0 0 0-1-1V1a1 1 0 0 0-1-1zm2.5 5.034v1.1l.953-.55.5.867L9 7l.953.55-.5.866-.953-.55v1.1h-1v-1.1l-.953.55-.5-.866L7 7l-.953-.55.5-.866.953.55v-1.1zM2.25 9h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5A.25.25 0 0 1 2 9.75v-.5A.25.25 0 0 1 2.25 9m0 2h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5a.25.25 0 0 1-.25-.25v-.5a.25.25 0 0 1 .25-.25M2 13.25a.25.25 0 0 1 .25-.25h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5a.25.25 0 0 1-.25-.25zM13.25 9h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5a.25.25 0 0 1-.25-.25v-.5a.25.25 0 0 1 .25-.25M13 11.25a.25.25 0 0 1 .25-.25h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5a.25.25 0 0 1-.25-.25zm.25 1.75h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5a.25.25 0 0 1-.25-.25v-.5a.25.25 0 0 1 .25-.25" },
  { title: "Justiz, Rechtssystem und öffentliche Sicherheit", iconLabel: "shield fill check", iconPath: "M8 0c-.69 0-1.843.265-2.928.56-1.11.3-2.229.655-2.887.87a1.54 1.54 0 0 0-1.044 1.262c-.596 4.477.787 7.795 2.465 9.99a11.8 11.8 0 0 0 2.517 2.453c.386.273.744.482 1.048.625.28.132.581.24.829.24s.548-.108.829-.24a7 7 0 0 0 1.048-.625 11.8 11.8 0 0 0 2.517-2.453c1.678-2.195 3.061-5.513 2.465-9.99a1.54 1.54 0 0 0-1.044-1.263 63 63 0 0 0-2.887-.87C9.843.266 8.69 0 8 0m2.146 5.146a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 7.793z" },
  { title: "Landwirtschaft, Fischerei, Forstwirtschaft und Nahrungsmittel", iconLabel: "tree fill", iconPath: "M8.416.223a.5.5 0 0 0-.832 0l-3 4.5A.5.5 0 0 0 5 5.5h.098L3.076 8.735A.5.5 0 0 0 3.5 9.5h.191l-1.638 3.276a.5.5 0 0 0 .447.724H7V16h2v-2.5h4.5a.5.5 0 0 0 .447-.724L12.31 9.5h.191a.5.5 0 0 0 .424-.765L10.902 5.5H11a.5.5 0 0 0 .416-.777z" },
  { title: "Regierung und öffentlicher Sektor", iconLabel: "bank2", iconPath: "M8.277.084a.5.5 0 0 0-.554 0l-7.5 5A.5.5 0 0 0 .5 6h1.875v7H1.5a.5.5 0 0 0 0 1h13a.5.5 0 1 0 0-1h-.875V6H15.5a.5.5 0 0 0 .277-.916zM12.375 6v7h-1.25V6zm-2.5 0v7h-1.25V6zm-2.5 0v7h-1.25V6zm-2.5 0v7h-1.25V6zM8 4a1 1 0 1 1 0-2 1 1 0 0 1 0 2M.5 15a.5.5 0 0 0 0 1h15a.5.5 0 1 0 0-1z" },
  { title: "Regionen und Städte", iconLabel: "houses fill", iconPath: "M7.207 1a1 1 0 0 0-1.414 0L.146 6.646a.5.5 0 0 0 .708.708L1 7.207V12.5A1.5 1.5 0 0 0 2.5 14h.55a2.5 2.5 0 0 1-.05-.5V9.415a1.5 1.5 0 0 1-.56-2.475l5.353-5.354zm2.586.586a1 1 0 0 1 1.414 0l4.647 4.646a.5.5 0 0 1-.708.708L15 6.793V13.5a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 4 13.5V8.793l-.146.147a.5.5 0 1 1-.708-.708z" },
  { title: "Umwelt", iconLabel: "globe europe africa", iconPath: "M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0M3.668 2.501l-.288.646a.847.847 0 0 0 1.479.815l.245-.368a.81.81 0 0 1 1.034-.275.81.81 0 0 0 .724 0l.261-.13a1 1 0 0 1 .775-.05l.984.34q.118.04.243.054c.784.093.855.377.694.801-.155.41-.616.617-1.035.487l-.01-.003C8.274 4.663 7.748 4.5 6 4.5 4.8 4.5 3.5 5.62 3.5 7c0 1.96.826 2.166 1.696 2.382.46.115.935.233 1.304.618.449.467.393 1.181.339 1.877C6.755 12.96 6.674 14 8.5 14c1.75 0 3-3.5 3-4.5 0-.262.208-.468.444-.7.396-.392.87-.86.556-1.8-.097-.291-.396-.568-.641-.756-.174-.133-.207-.396-.052-.551a.33.33 0 0 1 .42-.042l1.085.724c.11.072.255.058.348-.035.15-.15.415-.083.489.117.16.43.445 1.05.849 1.357L15 8A7 7 0 1 1 3.668 2.501" },
  { title: "Verkehr", iconLabel: "car front fill", iconPath: "M2.52 3.515A2.5 2.5 0 0 1 4.82 2h6.362c1 0 1.904.596 2.298 1.515l.792 1.848c.075.175.21.319.38.404.5.25.855.715.965 1.262l.335 1.679q.05.242.049.49v.413c0 .814-.39 1.543-1 1.997V13.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.338c-1.292.048-2.745.088-4 .088s-2.708-.04-4-.088V13.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.892c-.61-.454-1-1.183-1-1.997v-.413a2.5 2.5 0 0 1 .049-.49l.335-1.68c.11-.546.465-1.012.964-1.261a.8.8 0 0 0 .381-.404l.792-1.848ZM3 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2m10 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2M6 8a1 1 0 0 0 0 2h4a1 1 0 1 0 0-2zM2.906 5.189a.51.51 0 0 0 .497.731c.91-.073 3.35-.17 4.597-.17s3.688.097 4.597.17a.51.51 0 0 0 .497-.731l-.956-1.913A.5.5 0 0 0 11.691 3H4.309a.5.5 0 0 0-.447.276L2.906 5.19Z" },
  { title: "Wirtschaft und Finanzen", iconLabel: "bar chart line fill", iconPath: "M11 2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h1V7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7h1z" },
  { title: "Wissenschaft und Technologie", iconLabel: "database fill gear", iconPath: "M8 1c-1.573 0-3.022.289-4.096.777C2.875 2.245 2 2.993 2 4s.875 1.755 1.904 2.223C4.978 6.711 6.427 7 8 7s3.022-.289 4.096-.777C13.125 5.755 14 5.007 14 4s-.875-1.755-1.904-2.223C11.022 1.289 9.573 1 8 1m-.096 7.198C6.427 8.18 5.096 7.88 4.096 7.425 3.463 7.137 2.937 6.768 2.579 6.326 2.214 6.69 2 7.246 2 8c0 1.007.875 1.755 1.904 2.223C4.978 10.711 6.427 11 8 11h.027a4.6 4.6 0 0 1 .18-2.801zm-.02 4.997C6.412 13.175 5.087 12.876 4.096 12.425 3.068 11.957 2.192 11.21 2.004 10.205 2.002 10.276 2 10.36 2 10.5c0 1.007.875 1.755 1.904 2.223C4.978 13.211 6.427 13.5 8 13.5q.134 0 .266-.003a4.6 4.6 0 0 1-.382-.302M12.096 7.425C11.348 7.765 10.4 8.014 9.342 8.129a4.6 4.6 0 0 1 2.56-.008c.78-.267 1.469-.667 1.91-1.146a2.8 2.8 0 0 0-.391-.649c-.358.442-.884.81-1.517 1.099z" },
];

const featuredTitles = [
  "Bebauungspläne Köln Bauungspläne",
  "Statistischer Datenkatalog Köln",
  "Baumkataster Köln Fortlaufend aktualisiert",
  "Bebauungspläne Köln Aufstellungsbeschlüsse ",
];

const featuredIconPath = "M4 11a1 1 0 1 1 2 0v1a1 1 0 1 1-2 0zm6-4a1 1 0 1 1 2 0v5a1 1 0 1 1-2 0zM7 9a1 1 0 0 1 2 0v3a1 1 0 1 1-2 0z M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1z M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0z";

export default function HomePage({ onSearch, openSettings, openHomePage, datasets, openDatasetsPage, setFilters }) {
  const [homeQuery, setHomeQuery] = useState("");

  async function submit(e) {
    e.preventDefault();
    const success = await onSearch(homeQuery);
    if (success) setHomeQuery("");
  }

  function openCategory(category) {
    setFilters({ theme: [category], format: [], publisher: [], year: [], license: [], keyword: [] });
    openDatasetsPage();
  }

  const featuredDatasets = featuredTitles
    .map((title) => datasets.find((dataset) => dataset.title === title))
    .filter(Boolean);

  return (
    <>
      <section className="hero">
        <div className="hero-box">
          <h1>Die beste Grundlage für fundierte Entscheidungen: offene Daten aus Ihrer Region.</h1>
          <form className="hero-search" onSubmit={submit}>
            <input placeholder="Datensätze suchen" value={homeQuery} onChange={(e) => setHomeQuery(e.target.value)} />
            <button type="submit" className="hero-search-button" aria-label="Suche">⌕</button>
            <button type="button" className="hero-settings-button" aria-label="Einstellungen" onClick={openSettings}>⚙</button>
          </form>
        </div>
      </section>

      <main className="home-content">
        <small>KI generiertes Bild</small>
        <section className="home-intro">
          <h2>Offene Daten Köln</h2>
          <p className="home-lead">Daten entdecken. Köln besser verstehen. Neues entwickeln.</p>
          <p>Dieses Portal stellt offene Verwaltungsdaten der Stadt Köln und Partner bereit.</p>
          <p>Die Daten können frei genutzt, analysiert und weiterverarbeitet werden – für Anwendungen, Analysen und neue Ideen rund um Köln.</p>
          <p>Offene Daten Köln – frei zugänglich, maschinenlesbar und für alle nutzbar.</p>
        </section>

        <section className="home-section">
          <div className="section-title-row">
            <h2>Beliebte Datensätze</h2>
            <button type="button" onClick={openDatasetsPage}>Alle Datensätze</button>
          </div>
          <div className="featured-grid">
            {featuredDatasets.map((dataset) => (
              <article key={dataset.id} className="featured-card" onClick={() => window.open(dataset.originalUrl, "_blank", "noopener,noreferrer")}>
                <div className="featured-icon">
                  <svg viewBox="0 0 16 16" aria-label="clipboard data" role="img">
                    <path d={featuredIconPath} />
                  </svg>
                </div>
                <div className="featured-text">
                  <h3>{dataset.title.trim()}</h3>
                  <strong>Herausgeber: {dataset.publisher}</strong>
                  <p>{truncate(dataset.description, 155)}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="home-section categories-section">
          <h2>Kategorien</h2>
          <div className="category-grid">
            {categoryLinks.map((category) => (
              <button key={category.title} type="button" className="category-tile" onClick={() => openCategory(category.title)}>
                <svg className="category-icon" viewBox="0 0 16 16" aria-label={category.iconLabel} role="img">
                  <path d={category.iconPath} />
                </svg>
                <span>{category.title}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="home-section news-section">
          <div className="section-title-row">
            <h2>News</h2>
            <button type="button" onClick={() => window.open("https://offenedaten-koeln.de/blog", "_blank", "noopener,noreferrer")}>Alle News anzeigen</button>
          </div>
          <div className="news-list">
            <article className="news-feature" onClick={() => window.open("https://offenedaten-koeln.de/node/43743", "_blank", "noopener,noreferrer")}>
              <img src="https://offenedaten-koeln.de/sites/default/files/styles/blog_stage/public/2026-03/Blog_Offene_Daten_Koeln_Der_neue_Motor_0.png?itok=0XyUdse5" alt="Offene Daten Köln im neuen Design" />
              <div className="news-feature-box">
                <h3>Offene Daten Köln im neuen Design und auf neuer technischer Basis</h3>
                <p>Das Portal Offene Daten Köln präsentiert sich ab sofort in neuem Design und auf einer vollständig modernisierten technischen Grund</p>
                <span>Weiterlesen</span>
              </div>
            </article>

            <article className="news-api-card" onClick={() => window.open("https://offenedaten-koeln.de/node/44162", "_blank", "noopener,noreferrer")}>
              <div className="news-api-header">
                <h3>Daten per API abrufen – einfach erklärt</h3>
                <button type="button">Artikel anzeigen</button>
              </div>
              <p>Wer offene Daten nutzen möchte, muss sie nicht immer erst manuell herunterladen. Viele Datensätze im Open-Data-Portal der Stadt Köln lassen sich auch direkt über eine API abrufen.</p>
            </article>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-inner">
          <div>
            <p className="footer-brand-note">Angetrieben durch <a href="https://www.drupal.org/" target="_blank" rel="noreferrer">Drupal</a></p>
            <button type="button" className="footer-logo-button" onClick={openHomePage} aria-label="Offene Daten Köln Startseite">
              <img className="footer-logo-img" src="https://offenedaten-koeln.de/themes/custom/dkan_bootstrap5/dist/bootstrap/img/logo.svg" alt="Offene Daten Köln" />
            </button>
            <a className="footer-city" href="https://www.stadt-koeln.de/" target="_blank" rel="noreferrer" aria-label="Stadt Köln">
              <img className="footer-city-img" src="https://offenedaten-koeln.de/themes/custom/dkan_bootstrap5/dist/bootstrap/img/parent-logo.svg" alt="Stadt Köln" />
            </a>
          </div>
          <div>
            <h4 className="footer-service-title">Service</h4>
            <a href="https://offenedaten-koeln.de/barrierefreiheit" target="_blank" rel="noreferrer">Barrierefreiheit</a>
            <a href="https://offenedaten-koeln.de/datenschutz" target="_blank" rel="noreferrer">Datenschutz</a>
            <a href="https://offenedaten-koeln.de/impressum" target="_blank" rel="noreferrer">Impressum</a>
            <a href="https://offenedaten-koeln.de/form/kontakt" target="_blank" rel="noreferrer">Kontakt</a>
            <a href="https://offenedaten-koeln.de/leichtesprache" target="_blank" rel="noreferrer">Leichte Sprache</a>
            <a href="https://offenedaten-koeln.de/nutzungsbedingungen" target="_blank" rel="noreferrer">Nutzungsbedingungen</a>
          </div>
          <div>
            <a className="footer-login-link" href="https://offenedaten-koeln.de/user/login" target="_blank" rel="noreferrer">Anmelden</a>
            <a className="footer-rss-original" href="https://offenedaten-koeln.de/datasets.rss" target="_blank" rel="noreferrer" aria-label="RSS Feed">
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path d="M2 2a12 12 0 0 1 12 12h-2.5A9.5 9.5 0 0 0 2 4.5zm0 5a7 7 0 0 1 7 7H6.5A4.5 4.5 0 0 0 2 9.5zM3.5 11a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}

function truncate(value, maxLength) {
  const text = String(value || "").trim();
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}…`;
}
