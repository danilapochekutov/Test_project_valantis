import React, {useState} from "react";
import "./filters.scss";

const Filters = ({onFilter, onShowAll, loading}) => {
	const [selectedFilter, setSelectedFilter] = useState("");
	const [filterValue, setFilterValue] = useState("");

	const handleFilterChange = (filter) => {
		setSelectedFilter(filter);
		setFilterValue("");
	};

	const handleFilter = async () => {
		if (selectedFilter !== "" && (filterValue !== "" || selectedFilter === "name")) {
			const filters = {
				[selectedFilter]: parseFloat(filterValue) || filterValue,
			};
			await onFilter(filters);
		}
	};

	const handleShowAll = () => {
		onShowAll();
	};

	const isFiltering = selectedFilter !== "" && (filterValue !== "" || selectedFilter === "name");

	return (
		<div className='filters'>
			<label>
				<input
					type='radio'
					name='filterType'
					value='name'
					checked={selectedFilter === "name"}
					onChange={() => handleFilterChange("name")}
				/>
				Name
			</label>
			<label>
				<input
					type='radio'
					name='filterType'
					value='price'
					checked={selectedFilter === "price"}
					onChange={() => handleFilterChange("price")}
				/>
				Price
			</label>
			<label>
				<input
					type='radio'
					name='filterType'
					value='brand'
					checked={selectedFilter === "brand"}
					onChange={() => handleFilterChange("brand")}
				/>
				Brand
			</label>
			<input
				type='text'
				placeholder={`Filter by ${selectedFilter}`}
				value={filterValue}
				onChange={(e) => setFilterValue(e.target.value)}
			/>
			<button onClick={handleFilter} disabled={!isFiltering || loading}>
				{loading ? "Loading..." : "Apply Filter"}
			</button>
			<button onClick={handleShowAll} disabled={loading}>
				Show All
			</button>
		</div>
	);
};

export default Filters;
