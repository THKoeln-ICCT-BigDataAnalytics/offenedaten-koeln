import { useEffect, useId, useRef, useState } from "react";
import SearchSettings from "./SearchSettings";

// Suchfeld mit Such- und Einstellungs-Button. Die Sucheinstellungen öffnen sich
// als Popover direkt unter dem Suchfeld.
export default function SearchForm({ value, onChange, onSubmit, settings, variant = "page" }) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const wrapRef = useRef(null);
  const gearRef = useRef(null);
  const panelId = useId();
  const isHero = variant === "hero";

  useEffect(() => {
    if (!settingsOpen) return undefined;
    function handle(e) {
      if (e.type === "keydown") {
        if (e.key === "Escape") closeSettings();
        return;
      }
      if (!wrapRef.current?.contains(e.target)) setSettingsOpen(false);
    }
    document.addEventListener("mousedown", handle);
    document.addEventListener("keydown", handle);
    return () => {
      document.removeEventListener("mousedown", handle);
      document.removeEventListener("keydown", handle);
    };
  }, [settingsOpen]);

  function closeSettings() {
    setSettingsOpen(false);
    gearRef.current?.focus();
  }

  function submit(e) {
    setSettingsOpen(false);
    onSubmit(e);
  }

  return (
    <div className={`search-wrap search-wrap-${variant}`} ref={wrapRef}>
      <form className="search-form" role="search" onSubmit={submit}>
        <input type="search" className="form-control form-control-lg" placeholder="Datensätze suchen" aria-label="Datensätze suchen" value={value} onChange={(e) => onChange(e.target.value)} />
        <button type="submit" className={`btn btn-icon ${isHero ? "btn-outline-light" : "btn-primary"}`} aria-label="Suchen">
          <i className="bi bi-search" aria-hidden="true"></i>
        </button>
        <button
          type="button"
          ref={gearRef}
          className={`btn btn-icon ${isHero ? "btn-outline-light" : "btn-outline-primary"}`}
          aria-label="Sucheinstellungen"
          title="Sucheinstellungen"
          aria-expanded={settingsOpen}
          aria-controls={settingsOpen ? panelId : undefined}
          onClick={() => setSettingsOpen((open) => !open)}
        >
          <i className="bi bi-gear" aria-hidden="true"></i>
        </button>
      </form>
      {settingsOpen && <SearchSettings id={panelId} {...settings} onClose={closeSettings} />}
    </div>
  );
}
