export default function Pagination({ page, totalPages, setPage }) {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i <= 6 || i === totalPages || Math.abs(i - page) <= 1) pages.push(i);
  }

  return (
    <nav className="pager" aria-label="Seitennummerierung">
      <ul className="pagination">
        {page > 1 && (
          <>
            <li className="page-item"><button type="button" className="page-link" onClick={() => setPage(1)}>« Erste</button></li>
            <li className="page-item"><button type="button" className="page-link" onClick={() => setPage(page - 1)}>‹ Zurück</button></li>
          </>
        )}
        {pages.map((p, index) => (
          <PageEntry key={p} p={p} gap={index > 0 && p - pages[index - 1] > 1} page={page} setPage={setPage} />
        ))}
        {page < totalPages && (
          <>
            <li className="page-item"><button type="button" className="page-link" onClick={() => setPage(page + 1)}>Weiter ›</button></li>
            <li className="page-item"><button type="button" className="page-link" onClick={() => setPage(totalPages)}>Letzte »</button></li>
          </>
        )}
      </ul>
    </nav>
  );
}

function PageEntry({ p, gap, page, setPage }) {
  return (
    <>
      {gap && <li className="page-item disabled"><span className="page-link">…</span></li>}
      <li className={`page-item ${page === p ? "active" : ""}`}>
        <button type="button" className="page-link" aria-current={page === p ? "page" : undefined} onClick={() => setPage(p)}>{p}</button>
      </li>
    </>
  );
}
