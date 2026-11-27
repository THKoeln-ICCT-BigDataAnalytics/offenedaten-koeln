export default function Pagination({ page, totalPages, setPage }) {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i <= 6 || i === totalPages || Math.abs(i - page) <= 1) pages.push(i);
  }

  const uniquePages = [...new Set(pages)];

  return (
    <div className="pagination">
      {uniquePages.map((p, index) => (
        <span key={p}>
          {index > 0 && p - uniquePages[index - 1] > 1 && <button disabled>...</button>}
          <button className={page === p ? "active" : ""} onClick={() => setPage(p)}>{p}</button>
        </span>
      ))}
      {page < totalPages && (
        <>
          <button onClick={() => setPage(page + 1)}>Weiter ›</button>
          <button onClick={() => setPage(totalPages)}>Letzte »</button>
        </>
      )}
    </div>
  );
}
