import { useEffect, useRef, useState } from "react";

const THEME_STORAGE_KEY = "odk_theme";
const THEME_OPTIONS = [
  { value: "auto", label: "Auto", icon: "bi-circle-half" },
  { value: "light", label: "Hell", icon: "bi-sun-fill" },
  { value: "dark", label: "Dunkel", icon: "bi-moon-stars-fill" },
];

export default function Header({ onSearch, openHomePage, openDatasetsPage, pageName }) {
  const [headerQuery, setHeaderQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useColorMode();

  async function submit(e) {
    e.preventDefault();
    const success = await onSearch(headerQuery);
    if (success) setHeaderQuery("");
  }

  function navigate(open) {
    setMenuOpen(false);
    open();
  }

  return (
    <header className="site-header">
      <a className="skip-link" href="#main-content">Zum Inhalt</a>
      <div className="container header-bar">
        <h1 className="header-title">
          <a href="https://github.com/THKoeln-ICCT-BigDataAnalytics/offenedaten-koeln" target="_blank" rel="noopener noreferrer">
            GitHub (TH Köln ICCT)
          </a>
        </h1>

        <div className="header-actions">
          <div className={`header-nav ${menuOpen ? "is-open" : ""}`} id="main-navigation">
            <div className="header-nav-top">
              <button type="button" className="icon-button" aria-label="Datensätze suchen" onClick={() => navigate(openDatasetsPage)}>
                <i className="bi bi-search" aria-hidden="true"></i>
              </button>
              <button type="button" className="icon-button close-button" aria-label="Schließen" onClick={() => setMenuOpen(false)}>
                <i className="bi bi-x-lg" aria-hidden="true"></i>
              </button>
            </div>

            <ThemeMenu theme={theme} setTheme={setTheme} />

            <nav aria-label="Hauptnavigation">
              <ul className="nav-list">
                <li>
                  <button type="button" className={`nav-link ${pageName === "home" ? "active" : ""}`} aria-current={pageName === "home" ? "page" : undefined} onClick={() => navigate(openHomePage)}>
                    Start
                  </button>
                </li>
                <li>
                  <button type="button" className={`nav-link ${pageName === "datasets" ? "active" : ""}`} aria-current={pageName === "datasets" ? "page" : undefined} onClick={() => navigate(openDatasetsPage)}>
                    Datensätze
                  </button>
                </li>
              </ul>
            </nav>
          </div>
          {menuOpen && <div className="nav-backdrop" onClick={() => setMenuOpen(false)} />}

          <form className="header-search" role="search" onSubmit={submit}>
            <input type="search" className="form-control" placeholder="Datensätze suchen" aria-label="Datensätze suchen" value={headerQuery} onChange={(e) => setHeaderQuery(e.target.value)} />
            <button type="submit" className="btn btn-outline">Suche</button>
          </form>

          <button type="button" className="icon-button header-search-icon" aria-label="Datensätze suchen" onClick={() => navigate(openDatasetsPage)}>
            <i className="bi bi-search" aria-hidden="true"></i>
          </button>
          <button type="button" className="menu-toggle" aria-label="Navigation umschalten" aria-controls="main-navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen(true)}>
            <i className="bi bi-list" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    </header>
  );
}

function ThemeMenu({ theme, setTheme }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const current = THEME_OPTIONS.find((option) => option.value === theme) || THEME_OPTIONS[0];

  useEffect(() => {
    if (!open) return undefined;
    function close(e) {
      if (e.type === "keydown" && e.key !== "Escape") return;
      if (e.type === "mousedown" && wrapRef.current?.contains(e.target)) return;
      setOpen(false);
    }
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", close);
    };
  }, [open]);

  return (
    <div className="theme-menu" ref={wrapRef}>
      <button type="button" className="nav-link dropdown-toggle" aria-expanded={open} aria-label={`Dunkelmodus umschalten (${current.label})`} onClick={() => setOpen((value) => !value)}>
        <i className={`bi ${current.icon}`} aria-hidden="true"></i>
        <span className="theme-menu-label">Dunkelmodus umschalten</span>
      </button>
      {open && (
        <ul className="dropdown-menu">
          {THEME_OPTIONS.map((option) => (
            <li key={option.value}>
              <button
                type="button"
                className={`dropdown-item ${option.value === theme ? "active" : ""}`}
                aria-pressed={option.value === theme}
                onClick={() => {
                  setTheme(option.value);
                  setOpen(false);
                }}
              >
                <i className={`bi ${option.icon}`} aria-hidden="true"></i>
                {option.label}
                {option.value === theme && <i className="bi bi-check2 ms-auto" aria-hidden="true"></i>}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function useColorMode() {
  const [theme, setTheme] = useState(() => readStoredTheme());

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      const effective = theme === "auto" ? (media.matches ? "dark" : "light") : theme;
      document.documentElement.dataset.theme = effective;
    };
    apply();
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Speicher nicht verfügbar (z. B. privater Modus) – Auswahl gilt nur für diese Sitzung.
    }
    if (theme !== "auto") return undefined;
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, [theme]);

  return [theme, setTheme];
}

function readStoredTheme() {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return THEME_OPTIONS.some((option) => option.value === stored) ? stored : "light";
  } catch {
    return "light";
  }
}
