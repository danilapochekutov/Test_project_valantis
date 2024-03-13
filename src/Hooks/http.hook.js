import {useCallback} from "react";
import md5 from "md5";

const API_PASSWORD = "Valantis";

const generateAuthString = () => {
	const timestamp = new Date().toISOString().split("T")[0].replace(/-/g, "");
	return md5(`${API_PASSWORD}_${timestamp}`);
};

export const useHttp = () => {
	const request = useCallback(async (url, method = "GET", params = null) => {
		try {
			const authString = generateAuthString();
			const requestOptions = {
				method,
				headers: {
					"Content-Type": "application/json",
					"X-Auth": authString,
				},
			};

			if (method !== "GET" && params !== null) {
				requestOptions.body = JSON.stringify(params);
			}

			const response = await fetch(url, requestOptions);

			if (!response.ok) {
				throw new Error(`Could not fetch ${url}, status: ${response.status}`);
			}

			const data = response.status === 204 ? null : await response.json();
			return data;
		} catch (error) {
			throw error;
		} finally {
		}
	}, []);

	return {request};
};
