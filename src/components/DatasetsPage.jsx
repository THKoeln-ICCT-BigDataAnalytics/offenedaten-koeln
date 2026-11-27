import Filters from "./Filters";
import Pagination from "./Pagination";
import ResultCard from "./ResultCard";

const PAGE_SIZE = 10;

export default function DatasetsPage({ query, submittedQuery, setQuery, onSearch, openSettings, results, allDatasets, searched, loading, filters, setFilters, sortMode, setSortMode, page, setPage }) {
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <main className="datasets-page">
      <a className="breadcrumb" href="https://offenedaten-koeln.de/" target="_blank" rel="noreferrer">Startseite</a>
      <h1>Datensätze</h1>
      <h2>Bitte geben Sie einen Suchbegriff ein.</h2>

      <form className="dataset-search" onSubmit={submit}>
        <input placeholder="Datensätze suchen" value={query} onChange={(e) => setQuery(e.target.value)} />
        <button type="submit" className="dataset-search-button" aria-label="Suche">⌕</button>
        <button type="button" className="dataset-settings-button" aria-label="Einstellungen" onClick={openSettings}>⚙</button>
      </form>

      {loading && <p>Suche läuft...</p>}
      {!loading && (
        <h2>{searched && submittedQuery ? `Ihre Suche nach ${submittedQuery} ergab ${sorted.length} Treffer.` : `Ihre Suche ergab ${sorted.length} Treffer.`}</h2>
      )}

      {!loading && searched && sorted.length === 0 && (
        <div className="empty-box">
          <div className="empty-icon">⌕</div>
          <p>Beginnen Sie Ihre Suche, indem Sie in das obige Feld tippen.<br />Noch keine Ergebnisse - durchsuchen Sie die Seite, um zu finden, was Sie suchen.</p>
        </div>
      )}

      {!loading && sorted.length > 0 && (
        <div className="results-layout">
          <Filters datasets={baseList} filters={filters} setFilters={updateFilters} />
          <section className="results-section">
            <div className="sort-row">
              <strong>Sortieren nach</strong>
              <select value={sortMode} onChange={(e) => setSortMode(e.target.value)}>
                <option value="relevance">Relevanz</option>
                <option value="az">A-Z</option>
                <option value="za">Z-A</option>
              </select>
            </div>
            {visibleResults.map((dataset) => <ResultCard key={dataset.id} dataset={dataset} />)}
            <Pagination page={page} totalPages={totalPages} setPage={setPage} />
          </section>
        </div>
      )}
    </main>
  );
}

function applySorting(datasets, sortMode) {
  const copy = [...datasets];
  if (sortMode === "az") return copy.sort((a, b) => a.title.localeCompare(b.title));
  if (sortMode === "za") return copy.sort((a, b) => b.title.localeCompare(a.title));
  return copy.sort((a, b) => (b.cosine_similarity || 0) - (a.cosine_similarity || 0));
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
