import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faAngleDoubleLeft, faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons';

const Paginator = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const maxPagesToShow = 7;
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

  if (totalPages <= maxPagesToShow) {
    startPage = 1;
    endPage = totalPages;
  } else if (currentPage <= Math.ceil(maxPagesToShow / 2)) {
    startPage = 1;
    endPage = maxPagesToShow;
  } else if (currentPage >= totalPages - Math.floor(maxPagesToShow / 2)) {
    startPage = totalPages - maxPagesToShow + 1;
    endPage = totalPages;
  }

  return (
    <nav className="flex items-center justify-center gap-1.5 font-outfit" aria-label="Paginación">
      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-xs font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-100 disabled:opacity-30 disabled:pointer-events-none transition-colors border border-gray-200"
        title="Primera página"
      >
        <FontAwesomeIcon icon={faAngleDoubleLeft} />
      </button>

      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-xs font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-100 disabled:opacity-30 disabled:pointer-events-none transition-colors border border-gray-200"
        title="Página anterior"
      >
        <FontAwesomeIcon icon={faChevronLeft} />
      </button>

      <div className="flex items-center gap-1">
        {pageNumbers.slice(startPage - 1, endPage).map((number) => {
          const isActive = number === currentPage;
          return (
            <button
              key={number}
              onClick={() => onPageChange(number)}
              className={`inline-flex items-center justify-center min-w-[32px] h-8 px-2 rounded-lg text-xs font-semibold transition-all ${
                isActive
                  ? "bg-brand-500 text-white shadow-theme-xs ring-2 ring-brand-500/20"
                  : "text-gray-700 hover:text-brand-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {number}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-xs font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-100 disabled:opacity-30 disabled:pointer-events-none transition-colors border border-gray-200"
        title="Página siguiente"
      >
        <FontAwesomeIcon icon={faChevronRight} />
      </button>

      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-xs font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-100 disabled:opacity-30 disabled:pointer-events-none transition-colors border border-gray-200"
        title="Última página"
      >
        <FontAwesomeIcon icon={faAngleDoubleRight} />
      </button>
    </nav>
  );
};

export default Paginator;
