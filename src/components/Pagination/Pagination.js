// Pagination.js
import React from "react";
import "./pagination.scss";

const Pagination = ({currentPage, totalPages, loading, nextPage, prevPage}) => {
	const handlePrevPage = () => {
		if (!loading && currentPage > 1) {
			prevPage();
		}
	};

	const handleNextPage = () => {
		if (!loading && currentPage < totalPages) {
			nextPage();
		}
	};

	return (
		<nav>
			<ul className='pagination'>
				<li>
					<button
						onClick={handlePrevPage}
						disabled={currentPage === 1 || loading}
						className={`pagination-button ${
							currentPage === 1 || loading ? "disabled" : ""
						}`}
					>
						Предыдущая
					</button>
				</li>
				<li>
					<span className='page-number'>{currentPage}</span>
				</li>
				<li>
					<button
						onClick={handleNextPage}
						disabled={currentPage === totalPages || loading}
						className={`pagination-button ${
							currentPage === totalPages || loading ? "disabled" : ""
						}`}
					>
						Следующая
					</button>
				</li>
			</ul>
		</nav>
	);
};

export default Pagination;
