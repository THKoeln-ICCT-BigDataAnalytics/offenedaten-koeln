import { useState } from "react";
import Filters from "./Filters";
import Pagination from "./Pagination";
import ResultCard from "./ResultCard";

const PAGE_SIZE = 10;

export default function DatasetsPage({ query, submittedQuery, setQuery, onSearch, openSettings, openHomePage, results, allDatasets, searched, loading, filters, setFilters, sortMode, setSortMode, page, setPage }) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const baseList = searched ? results : allDatasets;
  const filtered = applyFilters(baseList, filters);
  const sorted = applySorting(filtered, sortMode);
  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const visibleResults = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  async function submit(e) {
    e.preventDefault();
    const success = await onSearch(query);
    if (success) setQuery("");
  }

  function updateFilters(nextFilters) {
    setFilters(nextFilters);
    setPage(1);
  }

  function changePage(nextPage) {
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <main className="container datasets-page" id="main-content">
      <nav aria-label="Pfadnavigation" className="breadcrumb">
        <a
          href="#start"
          onClick={(e) => {
            e.preventDefault();
            openHomePage();
          }}
        >
          Startseite
        </a>
      </nav>
      <h1 className="display-3">Datensätze</h1>

      <section className="search-intro">
        <h2>Bitte geben Sie einen Suchbegriff ein.</h2>
        <form className="search-form dataset-search" role="search" onSubmit={submit}>
          <input type="search" className="form-control form-control-lg" placeholder="Datensätze suchen" aria-label="Datensätze suchen" value={query} onChange={(e) => setQuery(e.target.value)} />
          <button type="submit" className="btn btn-primary btn-icon" aria-label="Suchen">
            <i className="bi bi-search" aria-hidden="true"></i>
          </button>
          <button type="button" className="btn btn-outline-primary btn-icon" aria-label="Sucheinstellungen" title="Sucheinstellungen" onClick={openSettings}>
            <i className="bi bi-gear" aria-hidden="true"></i>
          </button>
        </form>
      </section>

      {loading ? (
        <p className="h2 result-count" role="status">
          <span className="spinner" aria-hidden="true"></span> Suche läuft …
        </p>
      ) : (
        <p className="h2 result-count" role="status" aria-live="polite">
          {searched && submittedQuery ? `Ihre Suche nach ${submittedQuery} ergab ${sorted.length} Treffer.` : `Ihre Suche ergab ${sorted.length} Treffer.`}
        </p>
      )}

      {!loading && searched && sorted.length === 0 && (
        <div className="empty-box">
          <i className="bi bi-search" aria-hidden="true"></i>
          <p>Beginnen Sie Ihre Suche, indem Sie in das obige Feld tippen.<br />Noch keine Ergebnisse – durchsuchen Sie die Seite, um zu finden, was Sie suchen.</p>
        </div>
      )}

      {!loading && sorted.length > 0 && (
        <div className="results-layout">
          <Filters datasets={baseList} filters={filters} setFilters={updateFilters} open={filtersOpen} onClose={() => setFiltersOpen(false)} />
          <section className="results-section" aria-label="Suchergebnisse">
            <div className="sort-row">
              <label htmlFor="sort-select"><strong>Sortieren nach</strong></label>
              <select id="sort-select" className="sort-select" value={sortMode} onChange={(e) => setSortMode(e.target.value)}>
                <option value="relevance">Relevanz</option>
                <option value="az">A-Z</option>
                <option value="za">Z-A</option>
              </select>
            </div>
            <div className="filter-toggle-row">
              <strong>Filtern nach</strong>
              <button type="button" className="btn btn-dark btn-icon" aria-label="Filter umschalten" aria-expanded={filtersOpen} onClick={() => setFiltersOpen((open) => !open)}>
                <i className="bi bi-funnel-fill" aria-hidden="true"></i>
              </button>
            </div>
            <div className="result-list">
              {visibleResults.map((dataset) => <ResultCard key={dataset.id} dataset={dataset} />)}
            </div>
            <Pagination page={page} totalPages={totalPages} setPage={changePage} />
          </section>
        </div>
      )}
    </main>
  );
}

function applySorting(datasets, sortMode) {
  const copy = [...datasets];
  if (sortMode === "az") return copy.sort((a, b) => a.title.localeCompare(b.title, "de"));
  if (sortMode === "za") return copy.sort((a, b) => b.title.localeCompare(a.title, "de"));
  // "Relevanz": Reihenfolge der Suche beibehalten (Kosinus-Ähnlichkeit bzw. Reranker-Ranking).
  return copy;
}

function applyFilters(datasets, filters) {
  return datasets.filter((dataset) => {
    if (!matchesArray(filters.theme, dataset.categoriesArray)) return false;
    if (!matches(filters.publisher, dataset.publisher)) return false;
    if (!matches(filters.year, dataset.yearIssued)) return false;
    if (!matchesArray(filters.license, dataset.licensesArray)) return false;
    if (!matchesArray(filters.format, dataset.formatsArray)) return false;
    if (!matchesArray(filters.keyword, dataset.keywordsArray)) return false;
    return true;
  });
}

function matches(selected, value) {
  if (!selected || selected.length === 0) return true;
  const normalized = normalizeFilterValue(value);
  return normalized && selected.includes(normalized);
}

function matchesArray(selected, values) {
  if (!selected || selected.length === 0) return true;
  const normalizedValues = (values || []).map(normalizeFilterValue).filter(Boolean);
  return selected.some((value) => normalizedValues.includes(value));
}

function normalizeFilterValue(value) {
  const normalized = String(value || "").trim();
  if (!normalized || normalized.toLowerCase() === "null") return "";
  return normalized;
}
