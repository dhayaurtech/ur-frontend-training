'use client';
import { useState } from 'react';
import products from '../../data/products.json';
import {
  searchProducts,
  filterProductsByCategory,
  sortProducts,
  getInventorySummary,
  formatPrice,
  fetchProducts,
} from '../../lib/products.js';

const Product = () => {
  const [search, setSearch] = useState();
  const [searchProduct, setSearchProduct] = useState([]);
  const categories = [...new Set(products.map((prod) => prod.category))];
  const [filterProduct, setFilterProduct] = useState([]);
  const [sortProduct, setSortProduct] = useState([]);
  const [totalProduct, setTotalProduct] = useState(0);
  const [activeProduct, setActiveProduct] = useState(0);
  const [outofstockProduct, setOutofstockProduct] = useState(0);
  const [totalstockvalue, setTotalstockvalue] = useState(0);
  const [formattedPrice, setFormattedprice] = useState();
  const [fetchProduct, setFetchProduct] = useState([]);

  function handleSearch(val) {
    let result = searchProducts(products, val);
    setSearchProduct(result);
  }

  function handleFilter(val) {
    const result = filterProductsByCategory(products, val);
    setFilterProduct(result);
  }

  function handleSort(val, dir) {
    const result = sortProducts(products, val, dir);
    setSortProduct(result);
  }

  function handleInventorySummary() {
    const result = getInventorySummary(products);
    setTotalProduct(result.totalProducts);
    setActiveProduct(result.activeProducts);
    setOutofstockProduct(result.outOfStock);
    setTotalstockvalue(result.totalStockValue);
  }

  function handleFormatPrice(val) {
    const result = formatPrice(val);
    setFormattedprice(result);
  }

  async function handleFetch() {
    try {
      const result = await fetchProducts();
      setFetchProduct(result);
    } catch (error) {
      console.error(error.message);
    }
  }
  return (
    <>
      <h1>Product Data Utilities Task</h1>
      <div>
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products by name or category"
        />
        <button onClick={() => handleSearch(search)}>Search</button>
      </div>
      <div>
        <h1>Search Products</h1>
        <ul>
          {searchProduct.map((prod) => (
            <li key={prod.id}>
              {prod.name} - {prod.category}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h1>Filter Products by Category</h1>
        <select onChange={(e) => handleFilter(e.target.value)}>
          <option value="all">All</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category.toUpperCase()}
            </option>
          ))}
        </select>
        <ul>
          {filterProduct.map((prod) => (
            <li key={prod.id}>
              {prod.name} - {prod.category}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h1>Sort Products by Name, Price and CreatedAt</h1>
        <select
          onChange={(e) => {
            const [field, direction] = e.target.value.split('-');
            handleSort(field, direction);
          }}
        >
          <option value="name-ascending">Name - A to Z</option>
          <option value="name-descending">Name - Z to A</option>
          <option value="price-ascending">Price - low to high</option>
          <option value="price-descending">Price - high to low</option>
          <option value="createdAt-ascending">Date - Oldest to Newest</option>
          <option value="createdAt-descending">Date - Newest to Oldest</option>
        </select>
        <ul>
          {sortProduct.map((prod) => (
            <li key={prod.id}>
              {prod.name} - {prod.price} - {prod.createdAt}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h1>Inventory Summary</h1>
        <div>
          <h4>Total number of products : {totalProduct}</h4>
          <h4>Active products : {activeProduct}</h4>
          <h4>Out of stock products : {outofstockProduct}</h4>
          <h4>Total stock value : {totalstockvalue}</h4>
        </div>
        <button onClick={() => handleInventorySummary()}>
          Get Inventory Summary
        </button>
      </div>
      <div>
        <h1>Format Total Stock Value to INR</h1>
        <h4>Total stock value : {formattedPrice}</h4>
        <button onClick={() => handleFormatPrice(totalstockvalue)}>
          Format
        </button>
      </div>
      <div>
        <h1>Fetch Products</h1>
        <button onClick={() => handleFetch()}>Fetch products</button>
        <h2>Result : </h2>
        <ul>
          {fetchProduct.map((prod) => (
            <li key={prod.id}>{prod.title}</li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Product;
