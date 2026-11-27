import { useState } from "react";

const SOFT_LIMIT = 5;

export default function Filters({ datasets, filters, setFilters, open, onClose }) {
  const categories = countArrayValues(datasets, "categoriesArray");
  const formats = countArrayValues(datasets, "formatsArray");
  const publishers = countValues(datasets, "publisher");
  const years = countValues(datasets, "yearIssued", "descValue");
  const licenses = countArrayValues(datasets, "licensesArray");
  const keywords = countArrayValues(datasets, "keywordsArray");

  return (
    <aside className={`filters ${open ? "is-open" : ""}`} aria-label="Filter">
      <div className="filters-close">
        <p className="h6">Filter schließen</p>
        <button type="button" className="btn btn-outline btn-icon" aria-label="Filter schließen" onClick={onClose}>
          <i className="bi bi-x-lg" aria-hidden="true"></i>
        </button>
      </div>
      <h2 className="filters-title">Filtern nach</h2>
      <div className="filter-groups">
        <FilterGroup title="Kategorie" name="theme" values={categories} filters={filters} setFilters={setFilters} />
        <FilterGroup title="Format" name="format" values={formats} filters={filters} setFilters={setFilters} />
        <FilterGroup title="Herausgeber" name="publisher" values={publishers} filters={filters} setFilters={setFilters} />
        <FilterGroup title="Erstellungszeitraum" name="year" values={years} filters={filters} setFilters={setFilters} />
        <FilterGroup title="Lizenz" name="license" values={licenses} filters={filters} setFilters={setFilters} />
        <FilterGroup title="Schlagwort" name="keyword" values={keywords} filters={filters} setFilters={setFilters} />
      </div>
    </aside>
  );
}

function FilterGroup({ title, name, values, filters, setFilters }) {
  const [expanded, setExpanded] = useState(false);
  if (values.length === 0) return null;

  const selected = filters[name] || [];
  // Ausgewählte Werte bleiben immer sichtbar, auch wenn die Liste eingeklappt ist.
  const visibleValues = expanded ? values : values.filter(([value], index) => index < SOFT_LIMIT || selected.includes(value));

  return (
    <div className="filter-group">
      <h3>{title}</h3>
      <ul>
        {visibleValues.map(([value, count]) => {
          const id = `filter-${name}-${value}`.replace(/[^a-zA-Z0-9_-]/g, "-");
          return (
            <li key={value} className="form-check">
              <input
                type="checkbox"
                id={id}
                className="form-check-input"
                checked={selected.includes(value)}
                onChange={(e) => {
                  const next = e.target.checked ? [...selected, value] : selected.filter((v) => v !== value);
                  setFilters({ ...filters, [name]: next });
                }}
              />
              <label htmlFor={id}>
                {value} <span className="text-muted">({count})</span>
              </label>
            </li>
          );
        })}
      </ul>
      {values.length > SOFT_LIMIT && (
        <button type="button" className="btn-link" onClick={() => setExpanded((value) => !value)}>
          {expanded ? "Weniger" : "Mehr"}
        </button>
      )}
    </div>
  );
}

function countValues(datasets, key, sortMode = "count") {
  const map = new Map();
  datasets.forEach((dataset) => {
    const value = normalizeFilterValue(dataset[key]);
    if (!value) return;
    map.set(value, (map.get(value) || 0) + 1);
  });

  const entries = [...map.entries()];
  if (sortMode === "descValue") {
    return entries.sort((a, b) => String(b[0]).localeCompare(String(a[0]), "de", { numeric: true }));
  }

  return entries.sort((a, b) => b[1] - a[1]);
}

function countArrayValues(datasets, key) {
  const map = new Map();
  datasets.forEach((dataset) => {
    const values = dataset[key] || [];
    values.forEach((rawValue) => {
      const value = normalizeFilterValue(rawValue);
      if (!value) return;
      map.set(value, (map.get(value) || 0) + 1);
    });
  });
  return [...map.entries()].sort((a, b) => b[1] - a[1]);
}

function normalizeFilterValue(value) {
  const normalized = String(value || "").trim();
  if (!normalized || normalized.toLowerCase() === "null") return "";
  return normalized;
}
