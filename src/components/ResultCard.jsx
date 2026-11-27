import { openOriginal } from "../services/linkService";

const resultIconPath = "M4 11a1 1 0 1 1 2 0v1a1 1 0 1 1-2 0zm6-4a1 1 0 1 1 2 0v5a1 1 0 1 1-2 0zM7 9a1 1 0 0 1 2 0v3a1 1 0 1 1-2 0z M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1z M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0z";

export default function ResultCard({ dataset }) {
  return (
    <article className="result-card" onClick={() => openOriginal(dataset.originalUrl)}>
      <div className="result-icon">
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path d={resultIconPath} />
        </svg>
      </div>
      <div className="result-content">
        <h3>{dataset.title}</h3>
        <p className="publisher">Herausgeber: {dataset.publisher || "Unbekannt"}</p>
        <p className="description">{shorten(dataset.description, 220)}</p>
        <div className="formats">
          <strong>Formate</strong>
          {dataset.formatsArray.length > 0
            ? dataset.formatsArray.map((format) => <span key={format}>{format}</span>)
            : <span>Unbekannt</span>}
        </div>
      </div>
    </article>
  );
}

function shorten(text, maxLength) {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}
