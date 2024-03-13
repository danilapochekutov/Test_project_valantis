import {useHttp} from "../Hooks/http.hook";

const API_BASE_URL = "https://api.valantis.store:41000/";

const ApiFunctions = () => {
	const {request} = useHttp();

	// Функция для получения списка ID
	const handleGetIds = async () => {
		const url = `${API_BASE_URL}`;
		const params = {
			action: "get_ids",
			params: {},
		};

		try {
			const response = await request(url, "POST", params);
			const uniqueIds = Array.from(new Set(response.result));
			return uniqueIds;
		} catch (error) {
			console.error("Ошибка при запросе к API:", error);
			if (error.response && error.response.status === 401) {
				console.error(
					"Ошибка аутентификации. Идентификатор ошибки:",
					error.response.data.errorId,
				);
			}
			throw error;
		}
	};

	const handleGetItemById = async (id) => {
		const url = `${API_BASE_URL}`;
		const params = {
			action: "get_items",
			params: {ids: [id]},
		};

		try {
			const response = await request(url, "POST", params);
			return response.result[0];
		} catch (error) {
			console.error("Ошибка при запросе к API:", error);
			if (error.response && error.response.status === 401) {
				console.error(
					"Ошибка аутентификации. Идентификатор ошибки:",
					error.response.data.errorId,
				);
			}
			throw error;
		}
	};

	const handleFilterProducts = async (filters) => {
		const url = `${API_BASE_URL}`;
		const params = {
			action: "filter",
			params: filters,
		};

		try {
			const response = await request(url, "POST", params);
			return response.result;
		} catch (error) {
			console.error("Ошибка при запросе к API:", error);
			if (error.response && error.response.status === 401) {
				console.error(
					"Ошибка аутентификации. Идентификатор ошибки:",
					error.response.data.errorId,
				);
			}
			throw error;
		}
	};

	const fetchProductData = async (offset, limit, ids) => {
		try {
			if (ids.length === 0) {
				console.log("Нет ID для запроса товаров");
				return [];
			}

			let notProcessedIdsCount = 0;
			let fetchedProductsCount = 0;
			const fetchedProducts = [];

			while (fetchedProductsCount < limit && offset < ids.length) {
				const itemId = ids[offset];
				let product = null;

				try {
					product = await handleGetItemById(itemId);
					fetchedProducts.push(product);
					fetchedProductsCount++;
				} catch (productError) {
					notProcessedIdsCount++;
					console.error("Ошибка при получении товара по ID:", productError);

					// Проверка, является ли ошибка API-ошибкой
					if (productError.response && productError.response.status) {
						console.error(
							"Ошибка API. Идентификатор ошибки:",
							productError.response.data.errorId,
						);
					}
				}

				offset++;
			}

			console.log("Products:", fetchedProducts);
			console.log("Необработанных ID:", notProcessedIdsCount);
			return fetchedProducts;
		} catch (error) {
			console.error("Ошибка при получении данных:", error);
			if (error.response && error.response.status === 401) {
				console.error(
					"Ошибка аутентификации. Идентификатор ошибки:",
					error.response.data.errorId,
				);
			}
			throw error;
		}
	};

	return {
		handleGetIds,
		handleGetItemById,
		fetchProductData,
		handleFilterProducts,
	};
};

export default ApiFunctions;
