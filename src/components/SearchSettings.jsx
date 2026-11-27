export default function SearchSettings({ visible, apiKey, setApiKey, topK, setTopK, rerankerEnabled, setRerankerEnabled, onClose }) {
  if (!visible) return null;

  return (
    <div className="container">
      <section className="settings-box" aria-labelledby="settings-title">
        <div className="settings-header">
          <h2 id="settings-title" className="h5">Sucheinstellungen</h2>
          <button type="button" className="btn btn-outline btn-icon" aria-label="Einstellungen schließen" onClick={onClose}>
            <i className="bi bi-x-lg" aria-hidden="true"></i>
          </button>
        </div>
        <div className="settings-fields">
          <label className="settings-field">
            API-Key
            <input
              type="password"
              className="form-control"
              placeholder="API-Key eingeben"
              autoComplete="off"
              value={apiKey}
              onChange={(e) => {
                setApiKey(e.target.value);
                try {
                  sessionStorage.setItem("thki_api_key", e.target.value);
                } catch {
                  // sessionStorage nicht verfügbar – Key gilt nur bis zum Neuladen.
                }
              }}
            />
          </label>

          <label className="settings-field settings-field-small">
            Top-K
            <input type="number" className="form-control" min="1" max="100" value={topK} onChange={(e) => setTopK(Number(e.target.value))} />
          </label>

          <label className="switch-row">
            <input type="checkbox" role="switch" checked={rerankerEnabled} onChange={(e) => setRerankerEnabled(e.target.checked)} />
            <span className="switch-slider" aria-hidden="true"></span>
            <span>Reranker aktivieren</span>
          </label>
        </div>
      </section>
    </div>
  );
}
