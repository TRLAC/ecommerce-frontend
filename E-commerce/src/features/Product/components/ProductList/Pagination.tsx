type PaginationProps = {
  currentPage: number; // 1-based
  totalPages: number;
  onPageChange: (page: number) => void;
};

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages: (number | "...")[] = [];

  for (let i = 1; i <= totalPages; i++) {
    const isFirst = i === 1;
    const isLast = i === totalPages;
    const isNear = Math.abs(i - currentPage) <= 2;

    if (isFirst || isLast || isNear) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  const goPrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const goNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  return (
    <nav
      className="flex items-center justify-center gap-1.5 pt-8 pb-4"
      aria-label="Phân trang"
    >
      {/* Prev */}
      <button
        onClick={goPrev}
        disabled={currentPage === 1}
        className="w-8 h-8 flex items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:border-violet-300 hover:text-violet-600 disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label="Trang trước"
      >
        ←
      </button>

      {/* Pages */}
      {pages.map((p, idx) =>
        p === "..." ? (
          <span
            key={`ellipsis-${idx}`}
            className="w-8 h-8 flex items-center justify-center text-slate-400 text-xs"
          >
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`w-8 h-8 flex items-center justify-center rounded-xl border text-xs font-medium transition-all
              ${
                p === currentPage
                  ? "bg-violet-600 text-white border-violet-600"
                  : "border-slate-200 text-slate-600 hover:border-violet-300 hover:text-violet-600"
              }`}
            aria-current={p === currentPage ? "page" : undefined}
          >
            {p}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={goNext}
        disabled={currentPage === totalPages}
        className="w-8 h-8 flex items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:border-violet-300 hover:text-violet-600 disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label="Trang sau"
      >
        →
      </button>
    </nav>
  );
}