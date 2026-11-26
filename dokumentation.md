# Doku: Suche

Diese Suche arbeitet in drei Schritten:

1. Suchanfrage wird in ein Embedding umgewandelt.
2. Das Query-Embedding wird mit den gespeicherten Embeddings der Datensätze verglichen.
3. Optional sortiert Mistral die gefundenen Kandidaten neu und entfernt unpassende Treffer.

Die Anzahl der gewünschten Treffer `k` kann optional angegeben werden. Ohne Reranker werden die Top-`k` ähnlichsten Datensätze ausgegeben. Mit aktiviertem Reranker kann die finale Ergebnisliste kleiner als `k` sein, weil der Reranker entscheidet, welche Kandidaten passend sind und welche entfernt werden.

---

## 1. Query-Embedding erzeugen

Die eingegebene Suchanfrage wird an die Embedding-API geschickt. Die API wandelt den Text in einen Vektor um.

### API-Aufruf

```text
POST https://chat.kiconnect.nrw/api/v1/embeddings
```

### Header

```http
Authorization: Bearer <THKI_API_KEY>
Content-Type: application/json
Accept: application/json
```

### Body

```json
{
  "model": "qwen-qwen3-embedding-8b",
  "input": [
    "<SUCHANFRAGE>"
  ]
}
```

### Was wird neben der Anfrage mitgeschickt?

- `model`: das Embedding-Modell `qwen-qwen3-embedding-8b`
- `input`: die Suchanfrage als Textliste
- API-Key im Header
- Formatangaben im Header (`Content-Type`, `Accept`)

### Was kommt zurück?

Die API gibt ein Embedding zurück:

```json
{
  "data": [
    {
      "index": 0,
      "embedding": [0.0123, -0.0456, 0.0789]
    }
  ]
}
```

Genutzt wird:

```text
data[0].embedding
```

Dieses Embedding wird danach für den Vergleich mit den gespeicherten Embeddings der Datensätze verwendet.

---

## 2. Ähnliche Datensätze über gespeicherte Embeddings suchen

Das Query-Embedding wird mit den gespeicherten Embeddings der Datensätze verglichen.

Dabei werden zuerst die ähnlichsten Kandidaten bestimmt. Ohne Reranker werden diese Kandidaten direkt nach Similarity-Score absteigend ausgegeben. Wenn der Reranker aktiviert ist, werden sie stattdessen an den Reranker weitergegeben.

### Suchlogik

```text
Query-Embedding
→ Vergleich mit gespeicherten Embeddings der Datensätze
→ Sortierung nach geringster Cosine Distance bzw. höchster Cosine Similarity
→ Auswahl der ähnlichsten Kandidaten
→ Übergabe an den Reranker (optional)
```

### Was wird für den Vergleich verwendet?

- Query-Embedding als Vektor
- gespeicherte Embeddings der Datensätze
- Modellname: `qwen-qwen3-embedding-8b`, Vektorlänge: `4096`
- Anzahl der Kandidaten, standardmäßig `10`

### Was kommt zurück?

Eine Kandidatenliste mit:

- `dataset_id`
- `title`
- `description_llm`
- `cosine_similarity`

---

## 3. Optionales Reranking mit Mistral

Die Nutzung des Rerankers ist optional. Wenn der Reranker aktiviert ist, werden die Kandidaten aus dem Embedding-Vergleich an Mistral geschickt. Mistral entscheidet, welche Kandidaten wirklich passen und in welcher Reihenfolge sie stehen sollen.

Dadurch kann die finale Ergebnisliste variieren: Es müssen nicht immer genau `k` Ergebnisse zurückkommen. Wenn Mistral Kandidaten als unpassend bewertet, werden sie aus der Ergebnisliste entfernt.

Wichtig: Die echte `dataset_id` wird nicht direkt an den Mistral-Reranker geschickt. Vorher wird jeder Kandidat auf eine einfache `candidate_id` von `1` bis zur Anzahl der Kandidaten gemappt. Mistral gibt nur diese `candidate_id`-Werte zurück. Nach der Antwort werden die `candidate_id`-Werte wieder auf die echten Datensatz-IDs zurückgemappt.

### API-Aufruf

```text
POST https://chat.kiconnect.nrw/api/v1/chat/completions
```

### Header

```http
Authorization: Bearer <THKI_API_KEY>
Content-Type: application/json
Accept: application/json
```

### Body 1:1

```json
{
  "model": "mistralai-mistral-small-4-119b-2603",
  "messages": [
    {
      "role": "system",
      "content": "Du bist ein strenger Reranker für Open-Data-Suchergebnisse der Stadt Köln.\nBewerte jeden Kandidaten ausschließlich danach, wie gut die Beschreibung die Nutzeranfrage beantwortet.\nArbeite nach dem Prinzip einer Sliding-Window-Strategie: Vergleiche Kandidaten nicht isoliert, sondern immer im direkten Vergleich mit den anderen gelieferten Kandidaten, sodass die relative Reihenfolge der gesamten Kandidatenliste konsistent ist.\n\nAufgabe:\n- Gib die passenden Datensätze als sortierte Liste zurück.\n- Der wichtigste/beste Datensatz steht ganz oben.\n- Entferne Datensätze, die deiner Einschätzung nach überhaupt nicht zur Query passen.\n- Verzichte vollständig auf reranker_score oder andere Scores.\n- Die Reihenfolge der JSON-Liste ist die finale Reranking-Reihenfolge.\n- Keine zusätzliche Erklärung, kein Markdown.\n\nPflichtregeln:\n- Jeder zurückgegebene Kandidat muss aus der gelieferten Kandidatenliste stammen.\n- Gib keine neuen candidate_id-Werte aus.\n- Gib keine candidate_id doppelt aus.\n- Unpassende Kandidaten dürfen und sollen weggelassen werden.\n\nGib ausschließlich valides JSON zurück.\nSchema: {\"results\":[{\"candidate_id\":\"1\"}, {\"candidate_id\":\"2\"}]}"
    },
    {
      "role": "user",
      "content": "{\"query\":\"<SUCHANFRAGE>\",\"task\":\"Sortiere die passenden Suchergebnisse neu. Wichtigstes Ergebnis zuerst. Entferne Kandidaten, die überhaupt nicht zur Query passen. Gib keine Scores zurück.\",\"candidates\":[{\"candidate_id\":\"1\",\"description_llm\":\"<BESCHREIBUNG_KANDIDAT_1>\"},{\"candidate_id\":\"2\",\"description_llm\":\"<BESCHREIBUNG_KANDIDAT_2>\"}]}"
    }
  ],
  "max_completion_tokens": 4096,
  "temperature": 0
}
```

### Was wird neben dem Prompt mitgeschickt?

- `model`: `mistralai-mistral-small-4-119b-2603`
- `messages`: System-Prompt und User-Prompt
- `max_completion_tokens`: `4096`
- `temperature`: `0`
- API-Key im Header
- Formatangaben im Header (`Content-Type`, `Accept`)

### Was steht im User-Prompt?

Der User-Prompt enthält:

```json
{
  "query": "<SUCHANFRAGE>",
  "task": "Sortiere die passenden Suchergebnisse neu. Wichtigstes Ergebnis zuerst. Entferne Kandidaten, die überhaupt nicht zur Query passen. Gib keine Scores zurück.",
  "candidates": [
    {
      "candidate_id": "1",
      "description_llm": "<description_llm_KANDIDAT_1>"
    },
    {
      "candidate_id": "2",
      "description_llm": "<description_llm_KANDIDAT_2>"
    }
  ]
}
```
Hinweis: `description_llm` enthält strukturierte Informationen zum Datensatz: Titel, Schlagwörter, Kategorie und eine neue Beschreibung.

Die neue Beschreibung wurde mit GPT-5.5 generiert. Dafür wurden der Titel, die Schlagwörter, die Kategorie, die ursprüngliche Beschreibung des Datensatzes und Prompt an GPT-5.5 geschickt.

An den Mistral-Reranker wird anschließend `description_llm` zusammen mit der gemappten `candidate_id` übergeben.

### Was kommt zurück?

Mistral soll nur JSON zurückgeben:

```json
{
  "results": [
    {
      "candidate_id": "1"
    },
    {
      "candidate_id": "2"
    }
  ]
}
```

Die Reihenfolge in `results` ist die neue finale Reihenfolge.

Wenn ein Kandidat fehlt, wird er entfernt und nicht angezeigt.

---

## 4. Finale Ausgabe

Die zurückgegebenen `candidate_id`-Werte werden wieder den echten Datensatz-IDs aus der Kandidatenliste zugeordnet.

Danach werden maximal die ersten `top_k` Ergebnisse ausgegeben. Wenn der Reranker weniger passende Kandidaten zurückgibt, ist die finale Ergebnisliste kleiner als `top_k`.

Ausgegeben werden:

- Rang
- Titel
- Dataset-ID
- Cosine Similarity

---

## Kurzablauf

```text
Suchanfrage
→ Embedding-API gibt Query-Vektor zurück
→ Vergleich mit gespeicherten Embeddings der Datensätze
→ Ohne Reranker werden die Top-`k` ähnlichsten Datensätze direkt ausgegeben
→ Mit Reranker bekommt Mistral die Kandidaten und sortiert/filtert sie
→ finale Trefferliste wird ausgegeben
```

Hinweis:
Berechnung der Kosinus-Distanz und Ähnlichkeit.

Kernformeln

Kosinus-Distanz:	1 - cos(a, b) = 1 - (a·b) / (‖a‖·‖b‖)
Kosinus-Ähnlichkeit:	1 - cosine_distance  

Bei typischen Text-Embeddings liegt die Ähnlichkeit meist zwischen ca. 0 und 1.