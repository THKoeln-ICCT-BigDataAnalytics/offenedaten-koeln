import { useState } from "react";
import { externalLinkProps, originalLinks } from "../services/linkService";
import SearchForm from "./SearchForm";

// Reihenfolge und Icons wie auf offenedaten-koeln.de (Bootstrap Icons).
const categoryLinks = [
  { title: "Bevölkerung und Gesellschaft", icon: "bi-people-fill" },
  { title: "Bildung, Kultur und Sport", icon: "bi-mortarboard-fill" },
  { title: "Energie", icon: "bi-lightning-charge-fill" },
  { title: "Gesundheit", icon: "bi-hospital-fill" },
  { title: "Justiz, Rechtssystem und öffentliche Sicherheit", icon: "bi-shield-fill-check" },
  { title: "Landwirtschaft, Fischerei, Forstwirtschaft und Nahrungsmittel", icon: "bi-tree-fill" },
  { title: "Regierung und öffentlicher Sektor", icon: "bi-bank2" },
  { title: "Regionen und Städte", icon: "bi-houses-fill" },
  { title: "Umwelt", icon: "bi-globe-europe-africa" },
  { title: "Verkehr", icon: "bi-car-front-fill" },
  { title: "Wirtschaft und Finanzen", icon: "bi-bar-chart-line-fill" },
  { title: "Wissenschaft und Technologie", icon: "bi-database-fill-gear" },
];

const featuredTitles = [
  "Baumkataster Köln Fortlaufend aktualisiert",
  "Statistischer Datenkatalog Köln",
  "Bebauungspläne Köln Bauungspläne",
  "Bebauungspläne Köln Aufstellungsbeschlüsse ",
];

export default function HomePage({ onSearch, searchSettings, datasets, openDatasetsPage, setFilters }) {
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
        <div className="hero-image" style={{ backgroundImage: `url("${originalLinks.hero}")` }} aria-hidden="true"></div>
        <div className="container">
          <div className="hero-box">
            <h2 className="display-5"><a target="_blank" href="https://www.offenedaten-koeln.de/" rel="noopener noreferrer">Offene Daten Köln</a>: KI-gestützte Datensuche durch das ICCT Labor der Technischen Hochschule Köln.</h2>
            <SearchForm variant="hero" value={homeQuery} onChange={setHomeQuery} onSubmit={submit} settings={searchSettings} />
          </div>
        </div>
      </section>

      <main className="container home-main" id="main-content">
        <section className="home-block">
          <div className="block-header">
            <h2 className="display-6">Beliebte Datensätze</h2>
            <button type="button" className="btn-link-arrow" onClick={openDatasetsPage}>
              <i className="bi bi-arrow-return-right" aria-hidden="true"></i>
              Alle Datensätze
            </button>
          </div>
          <div className="featured-grid">
            {featuredDatasets.map((dataset) => (
              <a key={dataset.id} className="featured-card" href={dataset.originalUrl} {...externalLinkProps}>
                <div className="featured-icon">
                  <i className="bi bi-clipboard-data" aria-hidden="true"></i>
                </div>
                <div className="featured-body">
                  <h3 className="featured-title">{dataset.title.trim()}</h3>
                  <p className="text-muted">{dataset.publisher}</p>
                  <p className="featured-text">{truncate(dataset.description, 150)}</p>
                </div>
              </a>
            ))}
          </div>
        </section>

        <section className="home-block">
          <div className="block-header">
            <h2 className="display-6">Kategorien</h2>
          </div>
          <div className="category-grid">
            {categoryLinks.map((category) => (
              <button key={category.title} type="button" className="category-tile" onClick={() => openCategory(category.title)}>
                <i className={`bi ${category.icon}`} aria-hidden="true"></i>
                <span>{category.title}</span>
              </button>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}

function truncate(value, maxLength) {
  const text = String(value || "").replace(/\s+/g, " ").trim();
  if (text.length <= maxLength) return text;
  const cut = text.slice(0, maxLength);
  return `${cut.slice(0, cut.lastIndexOf(" ") > 0 ? cut.lastIndexOf(" ") : maxLength).trim()}…`;
}
