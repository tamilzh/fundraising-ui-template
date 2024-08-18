import React from "react";
import { usePagination, DOTS } from "../hooks/usePagination";
import constant from "../utils/constant";
const Pagination = (props) => {
  const {
    onPageChange,
    totalCount,
    siblingCount = 1,
    currentPage,
    pageSize,
  } = props;

  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize,
  });
  if (currentPage === 0 || paginationRange.length < 2) {
    return null;
  }

  const onNext = () => {
    onPageChange(currentPage + 1);
  };

  const onPrevious = () => {
    onPageChange(currentPage - 1);
  };

  let lastPage = paginationRange[paginationRange.length - 1];
  return (
    <div
      className="pagination__wrapper"
      style={
        paginationRange.length === 1
          ? { display: "none" }
          : { display: "block" }
      }
    >
      <ul className="pagination" key={paginationRange.length}>
        <li
          className="page-number"
          onClick={onPrevious}
          style={
            currentPage === 1
              ? { display: "none" }
              : {
                  display: "inline-block",
                  fontWeight: "500",
                }
          }
        >
          Previous
        </li>
        {paginationRange.map((pageNumber) => {
          if (pageNumber === DOTS) {
            return (
              <li
                key={pageNumber}
                className="page-number"
                style={{ cursor: "default" }}
              >
                &#8230;
              </li>
            );
          }

          return (
            <li
              className="page-number"
              key={pageNumber}
              onClick={() => onPageChange(pageNumber)}
              style={
                currentPage === pageNumber
                  ? { fontWeight: "bold" }
                  : { fontWeight: "400" }
              }
            >
              {pageNumber}
            </li>
          );
        })}
        <li
          className="page-number"
          onClick={onNext}
          style={
            currentPage === lastPage
              ? { display: "none" }
              : {
                  display: "inline-block",
                  fontWeight: "500",
                }
          }
        >
          Next
        </li>
      </ul>
    </div>
  );
};

export default Pagination;
