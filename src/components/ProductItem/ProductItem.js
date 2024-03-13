import React from "react";

import "./productItem.scss";

const ProductItem = ({product}) => {
	return (
		<div className='product-item'>
			<p>ID: {product.id}</p>
			<p>Name: {product.product}</p>
			<p>Price: {product.price}</p>
			<p>Brand: {product.brand}</p>
		</div>
	);
};

export default ProductItem;
