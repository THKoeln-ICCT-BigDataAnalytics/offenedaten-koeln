export class Dataset {
  constructor(row) {
    this.id = row.id || "";
    this.title = row.title || "";
    this.description = row.description || "";
    this.keyword = row.keyword || "";
    this.theme = row.theme || "";
    this.publisher = row.publisher || "";
    this.issued = row.issued || "";
    this.modified = row.modified || "";
    this.license = row.license || "";
    this.description_llm = row.description_llm || "";
    this["qwen3-embedding-8b"] = parseEmbedding(row["qwen3-embedding-8b"]);
    this.format = row.format || "";
    this.cosine_similarity = null;
  }

  get embedding() {
    return this["qwen3-embedding-8b"];
  }

  get keywordsArray() {
    return splitMultiValue(this.keyword);
  }

  get formatsArray() {
    return splitMultiValue(this.format).map((format) => format.toUpperCase());
  }

  get categoriesArray() {
    return splitMultiValue(this.theme);
  }

  get licensesArray() {
    return splitMultiValue(this.license);
  }

  get yearIssued() {
    if (!this.issued) return "";
    const match = String(this.issued).match(/\d{4}/);
    return match ? match[0] : "";
  }

  get slug() {
    return createDatasetSlug(this.title);
  }

  get originalUrl() {
    return `https://offenedaten-koeln.de/dataset/${this.slug}`;
  }
}

function parseEmbedding(value) {
  if (!value) return [];
  try {
    if (Array.isArray(value)) return value;
    return JSON.parse(value);
  } catch {
    try {
      return String(value)
        .replace("[", "")
        .replace("]", "")
        .split(",")
        .map(Number)
        .filter((n) => !Number.isNaN(n));
    } catch {
      return [];
    }
  }
}

function splitMultiValue(value) {
  if (!value) return [];

  const text = String(value).trim();
  if (!text || text === "{}" || text === "[]") return [];

  try {
    const parsed = JSON.parse(text.replace(/'/g, '"'));

    if (Array.isArray(parsed)) {
      return parsed.map((item) => cleanTextValue(extractJsonValue(item))).filter(Boolean);
    }

    if (parsed && typeof parsed === "object") {
      return [cleanTextValue(extractJsonValue(parsed))].filter(Boolean);
    }
  } catch {
    // CSV-Werte wie {"Regionen und Städte",Verkehr} sind kein valides JSON.
  }

  const hasListWrapper =
    (text.startsWith("{") && text.endsWith("}")) ||
    (text.startsWith("[") && text.endsWith("]"));
  const content = hasListWrapper ? text.slice(1, -1) : text;

  return splitRespectingQuotes(content)
    .map((item) => cleanTextValue(item))
    .filter(Boolean);
}

function splitRespectingQuotes(value) {
  const items = [];
  let current = "";
  let quote = null;

  for (const char of String(value)) {
    if ((char === '"' || char === "'") && quote === null) {
      quote = char;
      current += char;
      continue;
    }

    if (char === quote) {
      quote = null;
      current += char;
      continue;
    }

    if (!quote && (char === "," || char === ";" || char === "|")) {
      items.push(current);
      current = "";
      continue;
    }

    current += char;
  }

  items.push(current);
  return items;
}

function extractJsonValue(item) {
  if (item == null) return "";
  if (typeof item === "string") return item;
  if (typeof item !== "object") return String(item);

  return (
    item.title ||
    item.name ||
    item.label ||
    item.display_name ||
    item.format ||
    item.id ||
    ""
  );
}

function cleanTextValue(value) {
  return String(value || "")
    .replace(/[{}\[\]]/g, "")
    .replace(/^"|"$/g, "")
    .replace(/^'|'$/g, "")
    .replace(/^format:/i, "")
    .replace(/^name:/i, "")
    .replace(/^label:/i, "")
    .trim();
}

// offenedaten-koeln.de (Drupal/DKAN) erzeugt die Datensatz-URLs mit dem
// Pathauto-Modul aus dem Titel. Diese Funktion bildet dessen Standardregeln nach:
// deutsche Transliteration, Satzzeichen entfernen (Bindestrich -> Trenner),
// englische Füllwörter entfernen ("Container in Köln" -> "container-koeln")
// und den Alias "dataset/<slug>" wortweise auf 100 Zeichen kürzen.
const PATHAUTO_IGNORE_WORDS =
  "a|an|as|at|before|but|by|for|from|is|in|into|like|of|off|on|onto|per|since|than|the|this|that|to|up|via|with";
const PATHAUTO_MAX_LENGTH = 100;
const DATASET_ALIAS_PREFIX = "dataset/";

export function createDatasetSlug(title) {
  let text = String(title || "")
    .trim()
    .replace(/Ä/g, "Ae")
    .replace(/Ö/g, "Oe")
    .replace(/Ü/g, "Ue")
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[‐-―]/g, "-")
    .replace(/[^A-Za-z0-9\s-]/g, "");

  const withoutIgnoredWords = text.replace(new RegExp(`\\b(${PATHAUTO_IGNORE_WORDS})\\b`, "gi"), "");
  if (withoutIgnoredWords.trim()) text = withoutIgnoredWords;

  const slug = text
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();

  const alias = truncateWordSafe(DATASET_ALIAS_PREFIX + truncateWordSafe(slug, PATHAUTO_MAX_LENGTH), PATHAUTO_MAX_LENGTH);
  return alias.slice(DATASET_ALIAS_PREFIX.length);
}

function truncateWordSafe(value, maxLength) {
  if (value.length <= maxLength) return value;
  const match = value.match(new RegExp(`^([\\s\\S]{1,${maxLength}})[-/\\s]`));
  return match ? match[1] : value.slice(0, maxLength);
}
