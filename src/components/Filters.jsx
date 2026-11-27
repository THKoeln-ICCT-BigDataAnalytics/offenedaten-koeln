export default function Filters({ datasets, filters, setFilters }) {
  const categories = countArrayValues(datasets, "categoriesArray");
  const formats = countArrayValues(datasets, "formatsArray");
  const publishers = countValues(datasets, "publisher");
  const years = countValues(datasets, "yearIssued", "descValue");
  const licenses = countArrayValues(datasets, "licensesArray");
  const keywords = countArrayValues(datasets, "keywordsArray");

  return (
    <aside className="filters">
      <h3>Filtern nach</h3>
      <FilterGroup title="Kategorie" name="theme" values={categories} filters={filters} setFilters={setFilters} />
      <FilterGroup title="Format" name="format" values={formats} filters={filters} setFilters={setFilters} />
      <FilterGroup title="Herausgeber" name="publisher" values={publishers} filters={filters} setFilters={setFilters} />
      <FilterGroup title="Erstellungszeitraum" name="year" values={years} filters={filters} setFilters={setFilters} />
      <FilterGroup title="Lizenz" name="license" values={licenses} filters={filters} setFilters={setFilters} />
      <FilterGroup title="Schlagwort" name="keyword" values={keywords} filters={filters} setFilters={setFilters} />
    </aside>
  );
}

function FilterGroup({ title, name, values, filters, setFilters }) {
  return (
    <div className="filter-group">
      <h4>{title}</h4>
      {values.map(([value, count]) => (
        <label key={value}>
          <input
            type="checkbox"
            checked={(filters[name] || []).includes(value)}
            onChange={(e) => {
              const current = filters[name] || [];
              const next = e.target.checked ? [...current, value] : current.filter((v) => v !== value);
              setFilters({ ...filters, [name]: next });
            }}
          />
          {value} ({count})
        </label>
      ))}
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
