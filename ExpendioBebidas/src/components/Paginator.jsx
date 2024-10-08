import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faAngleDoubleLeft, faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons';

const Paginator = ({ currentPage, totalPages, onPageChange }) => {
  const maxPagesToShow = 10; // Cambia este valor según la cantidad de páginas que deseas mostrar
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

  if (startPage === 1 && endPage === 0) {
    endPage = 1;
  }

  return (
    <nav>
      <ul className='pagination justify-content-center'>
        <li className='page-item'>
          <button onClick={() => onPageChange(1)} className='page-link' disabled={currentPage === 1}>
            <FontAwesomeIcon icon={faAngleDoubleLeft} />
          </button>
        </li>
        <li className='page-item'>
          <button onClick={() => onPageChange(currentPage - 1)} className='page-link' disabled={currentPage === 1}>
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
        </li>
        {pageNumbers.slice(startPage - 1, endPage).map((number) => (
          <li key={number} className='page-item'>
            <button onClick={() => onPageChange(number)} className={`page-link ${number === currentPage ? 'active' : ''}`}>
              {number}
            </button>
          </li>
        ))}
        <li className='page-item'>
          <button onClick={() => onPageChange(currentPage + 1)} className='page-link' disabled={currentPage === totalPages}>
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </li>
        <li className='page-item'>
          <button onClick={() => onPageChange(totalPages)} className='page-link' disabled={currentPage === totalPages}>
            <FontAwesomeIcon icon={faAngleDoubleRight} />
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default Paginator;
