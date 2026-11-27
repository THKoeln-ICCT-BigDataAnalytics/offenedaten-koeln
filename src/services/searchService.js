const THKI_API_BASE_URL = import.meta.env.DEV ? "/thki/api/v1" : "https://chat.kiconnect.nrw/api/v1";
const EMBEDDING_API_URL = `${THKI_API_BASE_URL}/embeddings`;
const CHAT_API_URL = `${THKI_API_BASE_URL}/chat/completions`;
const EMBEDDING_MODEL = "qwen-qwen3-embedding-8b";
const RERANKER_MODEL = "mistralai-mistral-small-4-119b-2603";

export async function searchDatasets({ query, datasets, apiKey, topK = 10, rerankerEnabled = false }) {
  if (!query || query.trim().length < 3) return [];
  const queryEmbedding = await createQueryEmbedding(query, apiKey);

  const candidates = datasets
    .map((dataset) => {
      dataset.cosine_similarity = cosineSimilarity(queryEmbedding, dataset.embedding);
      return dataset;
    })
    .filter((dataset) => Number.isFinite(dataset.cosine_similarity))
    .sort((a, b) => b.cosine_similarity - a.cosine_similarity)
    .slice(0, topK);

  if (!rerankerEnabled) return candidates;
  return rerankWithMistral({ query, candidates, apiKey, topK });
}

export async function createQueryEmbedding(query, apiKey) {
  const response = await fetch(EMBEDDING_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ model: EMBEDDING_MODEL, input: [query] }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(`Embedding-API-Aufruf fehlgeschlagen (${response.status} ${response.statusText}): ${errorText}`);
  }
  const json = await response.json();
  return json.data?.[0]?.embedding || [];
}

export async function rerankWithMistral({ query, candidates, apiKey, topK }) {
  const candidateMap = new Map();
  const mappedCandidates = candidates.map((candidate, index) => {
    const candidateId = String(index + 1);
    candidateMap.set(candidateId, candidate);
    return { candidate_id: candidateId, description_llm: candidate.description_llm };
  });

  const body = {
    model: RERANKER_MODEL,
    messages: [
      {
        role: "system",
        content:
          "Du bist ein strenger Reranker für Open-Data-Suchergebnisse der Stadt Köln.\n" +
          "Bewerte jeden Kandidaten ausschließlich danach, wie gut die Beschreibung die Nutzeranfrage beantwortet.\n" +
          "Arbeite nach dem Prinzip einer Sliding-Window-Strategie: Vergleiche Kandidaten nicht isoliert, sondern immer im direkten Vergleich mit den anderen gelieferten Kandidaten, sodass die relative Reihenfolge der gesamten Kandidatenliste konsistent ist.\n\n" +
          "Aufgabe:\n" +
          "- Gib die passenden Datensätze als sortierte Liste zurück.\n" +
          "- Der wichtigste/beste Datensatz steht ganz oben.\n" +
          "- Entferne Datensätze, die deiner Einschätzung nach überhaupt nicht zur Query passen.\n" +
          "- Verzichte vollständig auf reranker_score oder andere Scores.\n" +
          "- Die Reihenfolge der JSON-Liste ist die finale Reranking-Reihenfolge.\n" +
          "- Keine zusätzliche Erklärung, kein Markdown.\n\n" +
          "Pflichtregeln:\n" +
          "- Jeder zurückgegebene Kandidat muss aus der gelieferten Kandidatenliste stammen.\n" +
          "- Gib keine neuen candidate_id-Werte aus.\n" +
          "- Gib keine candidate_id doppelt aus.\n" +
          "- Unpassende Kandidaten dürfen und sollen weggelassen werden.\n\n" +
          "Gib ausschließlich valides JSON zurück.\n" +
          "Schema: {\"results\":[{\"candidate_id\":\"1\"}, {\"candidate_id\":\"2\"}]}",
      },
      {
        role: "user",
        content: JSON.stringify({
          query,
          task: "Sortiere die passenden Suchergebnisse neu. Wichtigstes Ergebnis zuerst. Entferne Kandidaten, die überhaupt nicht zur Query passen. Gib keine Scores zurück.",
          candidates: mappedCandidates,
        }),
      },
    ],
    max_completion_tokens: 4096,
    temperature: 0,
  };

  const response = await fetch(CHAT_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(`Reranker-API-Aufruf fehlgeschlagen (${response.status} ${response.statusText}): ${errorText}`);
  }
  const json = await response.json();
  const content = json.choices?.[0]?.message?.content || "{}";

  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch {
    return candidates;
  }

  return (parsed.results || [])
    .map((result) => candidateMap.get(String(result.candidate_id)))
    .filter(Boolean)
    .slice(0, topK);
}

export function cosineSimilarity(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b)) return 0;
  if (a.length === 0 || b.length === 0) return 0;
  if (a.length !== b.length) return 0;

  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}
