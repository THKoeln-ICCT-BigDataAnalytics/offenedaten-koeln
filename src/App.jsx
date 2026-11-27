import { useEffect, useState } from "react";
import "./App.css";
import Header from "./components/Header";
import HomePage from "./components/HomePage";
import DatasetsPage from "./components/DatasetsPage";
import Footer from "./components/Footer";
import { loadDatasets } from "./services/csvService";
import { searchDatasets } from "./services/searchService";

export default function App() {
  const [datasets, setDatasets] = useState([]);
  const [results, setResults] = useState([]);
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState(sessionStorage.getItem("thki_api_key") || "");
  const [topK, setTopK] = useState(10);
  const [rerankerEnabled, setRerankerEnabled] = useState(true);
  const [pageName, setPageName] = useState("home");
  const [page, setPage] = useState(1);
  const [sortMode, setSortMode] = useState("relevance");
  const [filters, setFilters] = useState({ theme: [], format: [], publisher: [], year: [], license: [], keyword: [] });

  useEffect(() => {
    loadDatasets()
      .then(setDatasets)
      .catch((error) => {
        console.error(error);
        alert("Datensätze konnten nicht geladen werden.");
      });
  }, []);

  async function handleSearch(searchQuery) {
    if (!apiKey) {
      alert("Bitte zuerst API-Key eingeben.");
      return false;
    }
    if (!searchQuery || searchQuery.trim().length < 3) {
      alert("Bitte geben Sie mindestens 3 Zeichen ein.");
      return false;
    }

    setSubmittedQuery(searchQuery);
    setLoading(true);
    setSearched(true);
    setPageName("datasets");
    setFilters({ theme: [], format: [], publisher: [], year: [], license: [], keyword: [] });
    setSortMode("relevance");
    setPage(1);

    try {
      const found = await searchDatasets({ query: searchQuery, datasets, apiKey, topK, rerankerEnabled });
      setResults(found);
      setQuery("");
      return true;
    } catch (error) {
      console.error(error);
      alert(error.message || "Suche fehlgeschlagen.");
      return false;
    } finally {
      setLoading(false);
    }
  }

  function openHomePage() {
    setPageName("home");
    setSearched(false);
    setSubmittedQuery("");
    setResults([]);
    setPage(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openDatasetsPage() {
    setPageName("datasets");
    setSearched(false);
    setSubmittedQuery("");
    setResults([]);
    setSortMode("az");
    setPage(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const searchSettings = { apiKey, setApiKey, topK, setTopK, rerankerEnabled, setRerankerEnabled };

  return (
    <>
      <Header onSearch={handleSearch} openHomePage={openHomePage} openDatasetsPage={openDatasetsPage} pageName={pageName} />

      {pageName === "home" && <HomePage onSearch={handleSearch} searchSettings={searchSettings} datasets={datasets} openDatasetsPage={openDatasetsPage} setFilters={setFilters} />}
      {pageName === "datasets" && (
        <DatasetsPage
          query={query}
          submittedQuery={submittedQuery}
          setQuery={setQuery}
          onSearch={handleSearch}
          searchSettings={searchSettings}
          results={results}
          allDatasets={datasets}
          searched={searched}
          loading={loading}
          filters={filters}
          setFilters={setFilters}
          sortMode={sortMode}
          setSortMode={setSortMode}
          page={page}
          setPage={setPage}
        />
      )}

      {/* <Footer openHomePage={openHomePage} /> */}
    </>
  );
}
