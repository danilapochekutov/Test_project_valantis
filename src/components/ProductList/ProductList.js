import React, {useState, useEffect} from "react";
import ProductItem from "../ProductItem/ProductItem";
import Pagination from "../Pagination/Pagination";
import Filters from "../Filters/Filters";
import ApiFunctions from "../../services/apiFunctions";

import "./productList.scss";

const ProductList = () => {
	const apiFunctions = ApiFunctions();
	const [filteredProducts, setFilteredProducts] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [productsPerPage] = useState(50);
	const [lastLoadedPage, setLastLoadedPage] = useState(0);
	const [ids, setIds] = useState([]);
	const [totalPages, setTotalPages] = useState(0);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		fetchIds();
	}, []);

	useEffect(() => {
		if (currentPage > lastLoadedPage && ids.length > 0) {
			setLoading(true);
			fetchData(currentPage);
		}
	}, [ids, currentPage]);

	const fetchIds = async () => {
		try {
			const allIds = await apiFunctions.handleGetIds();
			setIds(allIds);
			setTotalPages(Math.ceil(allIds.length / productsPerPage));
		} catch (error) {
			console.error("Error fetching ids:", error);
		}
	};

	const fetchData = async (page) => {
		try {
			const offset = (page - 1) * productsPerPage;
			console.log(offset);
			const limit = productsPerPage;
			const products = await apiFunctions.fetchProductData(offset, limit, ids);

			setFilteredProducts((prevProducts) => [...prevProducts, ...products]);
			setLastLoadedPage(page);
			setLoading(false);
		} catch (error) {
			console.error("Error fetching products:", error);
			setLoading(false);
		}
	};

	const handleFilter = async (filters) => {
		setLoading(true);
		setLastLoadedPage(0);
		setCurrentPage(1);
		console.log(filters);
		try {
			const filteredIds = await apiFunctions.handleFilterProducts(filters);
			console.log(filteredIds);
			setFilteredProducts([]);
			setIds(filteredIds);
			setTotalPages(Math.ceil(filteredIds.length / productsPerPage));
		} catch (error) {
			console.error("Error filtering products:", error);
			setLoading(false);
		}
	};

	const handleShowAll = () => {
		setLoading(true);
		setFilteredProducts([]);
		setLastLoadedPage(0);
		setCurrentPage(1);
		fetchIds();
	};

	const nextPage = () => {
		if (currentPage < totalPages && !loading) {
			setCurrentPage(currentPage + 1);
		}
	};

	const prevPage = () => {
		if (currentPage > 1) {
			setCurrentPage(currentPage - 1);
		}
	};

	return (
		<div>
			<Filters onFilter={handleFilter} onShowAll={handleShowAll} loading={loading} />

			{loading ? (
				<div
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						marginTop: "40px",
						marginBottom: "40px",
					}}
				>
					Loading...
				</div>
			) : (
				<div className='product-list'>
					{filteredProducts
						.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage)
						.map((product, index) => (
							<ProductItem key={index} product={product} />
						))}
				</div>
			)}
			<Pagination
				currentPage={currentPage}
				totalPages={totalPages}
				loading={loading}
				nextPage={nextPage}
				prevPage={prevPage}
			/>
		</div>
	);
};

export default ProductList;

// const ProductList = () => {
// 	const apiFunctions = ApiFunctions();
// 	const [filteredProducts, setFilteredProducts] = useState([]);
// 	const [currentPage, setCurrentPage] = useState(1);
// 	const [productsPerPage] = useState(50);
// 	const [lastLoadedPage, setLastLoadedPage] = useState(0);

// 	useEffect(() => {
// 		if (currentPage > lastLoadedPage) {
// 			fetchData(currentPage);
// 		}
// 	}, [currentPage, lastLoadedPage]);

// 	const fetchData = async (page) => {
// 		try {
// 			const offset = (page - 1) * productsPerPage;
// 			const limit = productsPerPage;

// 			const products = await apiFunctions.fetchProductData(offset, limit);

// 			if (products.length < productsPerPage) {
// 				// Handle last page
// 			}

// 			setFilteredProducts((prevProducts) => [...prevProducts, ...products]);
// 			setLastLoadedPage(page);
// 		} catch (error) {
// 			console.error("Error fetching products:", error);
// 		}
// 	};

// 	const handleFilter = (filters) => {
// 		let filtered = [...filteredProducts];

// 		if (filters.name) {
// 			filtered = filtered.filter((product) =>
// 				product.product.toLowerCase().includes(filters.name.toLowerCase()),
// 			);
// 		}
// 		if (filters.price) {
// 			filtered = filtered.filter((product) => product.price === parseFloat(filters.price));
// 		}
// 		if (filters.brand) {
// 			filtered = filtered.filter((product) =>
// 				product.brand.toLowerCase().includes(filters.brand.toLowerCase()),
// 			);
// 		}

// 		setCurrentPage(1);
// 		setFilteredProducts(filtered);
// 		setLastLoadedPage(0); // Reset lastLoadedPage when applying filters
// 	};

// 	const paginate = (pageNumber) => {
// 		setCurrentPage(pageNumber);
// 	};

// 	return (
// 		<div>
// 			<Filters onFilter={handleFilter} />
// 			<div className='product-list'>
// 				{filteredProducts
// 					.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage)
// 					.map((product, index) => (
// 						<ProductItem key={index} product={product} />
// 					))}
// 			</div>
// 			<Pagination
// 				productsPerPage={productsPerPage}
// 				totalProducts={filteredProducts.length}
// 				currentPage={currentPage}
// 				paginate={paginate}
// 			/>
// 		</div>
// 	);
// };

// export default ProductList;
