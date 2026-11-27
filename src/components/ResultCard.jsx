import { externalLinkProps } from "../services/linkService";

export default function ResultCard({ dataset }) {
  return (
    <a className="result-card" href={dataset.originalUrl} {...externalLinkProps}>
      <h3 className="result-title">{dataset.title}</h3>
      <p className="text-muted result-publisher">Herausgeber: {dataset.publisher || "Unbekannt"}</p>
      <p className="result-description">{shorten(dataset.description, 150)}</p>
      <div className="formats">
        <p className="text-muted">Formate</p>
        <div className="format-list">
          {dataset.formatsArray.length > 0
            ? dataset.formatsArray.map((format) => <span key={format}>{format}</span>)
            : <span>Unbekannt</span>}
        </div>
      </div>
    </a>
  );
}

function shorten(value, maxLength) {
  const text = String(value || "").replace(/\s+/g, " ").trim();
  if (text.length <= maxLength) return text;
  const cut = text.slice(0, maxLength);
  return `${cut.slice(0, cut.lastIndexOf(" ") > 0 ? cut.lastIndexOf(" ") : maxLength).trim()}…`;
}
