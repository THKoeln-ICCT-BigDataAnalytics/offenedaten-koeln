import { Dataset } from "../models/Dataset";

export async function loadDatasets() {
  const response = await fetch(`${import.meta.env.BASE_URL}data.csv`);
  if (!response.ok) throw new Error("data.csv konnte nicht geladen werden.");
  const csvText = await response.text();
  const rows = parseCsv(csvText);
  return rows.map((row) => new Dataset(row));
}

export function parseCsv(csvText) {
  const rows = [];
  let currentRow = [];
  let currentValue = "";
  let insideQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (char === '"' && insideQuotes && nextChar === '"') {
      currentValue += '"';
      i++;
    } else if (char === '"') {
      insideQuotes = !insideQuotes;
    } else if (char === "," && !insideQuotes) {
      currentRow.push(currentValue);
      currentValue = "";
    } else if ((char === "\n" || char === "\r") && !insideQuotes) {
      if (char === "\r" && nextChar === "\n") i++;
      currentRow.push(currentValue);
      if (currentRow.some((v) => v.trim() !== "")) rows.push(currentRow);
      currentRow = [];
      currentValue = "";
    } else {
      currentValue += char;
    }
  }

  if (currentValue || currentRow.length > 0) {
    currentRow.push(currentValue);
    rows.push(currentRow);
  }

  const headers = rows[0];
  return rows.slice(1).map((row) => {
    const object = {};
    headers.forEach((header, index) => {
      object[header] = row[index] ?? "";
    });
    return object;
  });
}
