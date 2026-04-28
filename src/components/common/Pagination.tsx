import React from "react";
import { PaginationMeta } from "../../types";

interface Props {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<Props> = ({ meta, onPageChange }) => {
  const { page, totalPages, total, limit, hasNextPage, hasPrevPage } = meta;

  if (totalPages <= 1) return null;

  const getPageNumbers = (): (number | "...")[] => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push("...");
      for (
        let i = Math.max(2, page - 1);
        i <= Math.min(totalPages - 1, page + 1);
        i++
      )
        pages.push(i);
      if (page < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2 mt-3">
      <small className="text-muted">
        Showing{" "}
        <strong>
          {from}–{to}
        </strong>{" "}
        of <strong>{total}</strong> students
      </small>
      <nav>
        <ul className="pagination pagination-sm mb-0">
          <li className={`page-item ${!hasPrevPage ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => onPageChange(page - 1)}
              disabled={!hasPrevPage}
            >
              &laquo;
            </button>
          </li>
          {getPageNumbers().map((p, idx) =>
            p === "..." ? (
              <li key={`ellipsis-${idx}`} className="page-item disabled">
                <span className="page-link">…</span>
              </li>
            ) : (
              <li key={p} className={`page-item ${p === page ? "active" : ""}`}>
                <button
                  className="page-link"
                  onClick={() => onPageChange(p as number)}
                >
                  {p}
                </button>
              </li>
            )
          )}
          <li className={`page-item ${!hasNextPage ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => onPageChange(page + 1)}
              disabled={!hasNextPage}
            >
              &raquo;
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Pagination;
