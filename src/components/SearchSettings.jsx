export default function SearchSettings({ visible, apiKey, setApiKey, topK, setTopK, rerankerEnabled, setRerankerEnabled }) {
  if (!visible) return null;

  return (
    <div className="settings-box">
      <label>
        API-Key
        <input
          type="password"
          placeholder="API-Key eingeben"
          value={apiKey}
          onChange={(e) => {
            setApiKey(e.target.value);
            sessionStorage.setItem("thki_api_key", e.target.value);
          }}
        />
      </label>

      <label>
        Top-K
        <input type="number" min="1" max="100" value={topK} onChange={(e) => setTopK(Number(e.target.value))} />
      </label>

      <label className="switch-row">
        <span>Reranker aktivieren</span>
        <input type="checkbox" checked={rerankerEnabled} onChange={(e) => setRerankerEnabled(e.target.checked)} />
        <span className="switch-slider" aria-hidden="true"></span>
      </label>
    </div>
  );
}
