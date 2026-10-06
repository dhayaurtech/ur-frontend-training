import products from '../data/products.json' with { type: 'json' };

export function searchProducts(products, query) {
  const searchProducts = query.trim().toLowerCase();

  if (searchProducts === '') {
    return [];
  }

  const searchProds = products.filter(
    (prod) =>
      prod.name.toLowerCase().includes(searchProducts) ||
      prod.category.toLowerCase().includes(searchProducts),
  );

  return searchProds;
}

// console.log("Search products : ", searchProducts(products, "Electronics"));
// console.log("Search products : ", searchProducts(products, "   "));

export function filterProductsByCategory(products, category) {
  const categoryName = category.trim().toLowerCase();

  if (categoryName === 'all') {
    return products;
  }

  const filterProds = products.filter(
    (product) => product.category.toLowerCase() === categoryName,
  );

  return filterProds;
}

// console.log(
//   "Filter products : ",
//   filterProductsByCategory(products, "Electronics"),
// );

export function sortProducts(products, field, direction) {
  const sortDirection = direction.trim().toLowerCase();
  const sortField = field.trim().toLowerCase();

  if (sortDirection === 'ascending') {
    if (sortField === 'name') {
      const sortByName = products.toSorted((a, b) =>
        a.name.localeCompare(b.name),
      );
      return sortByName;
    } else if (sortField === 'price') {
      const sortByPrice = products.toSorted((a, b) => a.price - b.price);
      return sortByPrice;
    } else if (sortField === 'createdat') {
      const sortByDate = products.toSorted(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      );
      return sortByDate;
    }
  } else if (sortDirection === 'descending') {
    if (sortField === 'name') {
      const sortByName = products.toSorted((a, b) =>
        b.name.localeCompare(a.name),
      );
      return sortByName;
    } else if (sortField === 'price') {
      const sortByPrice = products.toSorted((a, b) => b.price - a.price);
      return sortByPrice;
    } else if (sortField === 'createdat') {
      const sortByDate = products.toSorted(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );
      return sortByDate;
    }
  }

  return products;
}

// console.log(
//   "Sorted Products by name : ",
//   sortProducts(products, "name", "descending"),
// );
// console.log(
//   "Sorted Products by price : ",
//   sortProducts(products, "price", "ascending"),
// );
// console.log(
//   "Sorted Products by createdAt : ",
//   sortProducts(products, "createdAt", "descending"),
// );

export function getInventorySummary(products) {
  const totalProducts = products.length;
  const activeProducts = products.filter((product) => product.isActive).length;
  const outOfStock = products.filter((product) => product.stock === 0).length;
  const totalStockValue = products.reduce(
    (acc, cur) => acc + cur.price * cur.stock,
    0,
  );

  return { totalProducts, activeProducts, outOfStock, totalStockValue };
}

// console.log("Inventory Summary : ", getInventorySummary(products));

export function formatPrice(amount) {
  const price = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount);

  return price;
}

// console.log(formatPrice(1299));
// console.log(formatPrice(50.25));

export async function fetchProducts() {
  try {
    const response = await fetch('https://dummyjson.com/products');

    if (!response.ok) {
      throw new Error(`Request failed : ${response.status}`);
    }

    const data = await response.json();

    return data.products;
  } catch (error) {
    throw new Error(`Failed to fetch products : ${error.message}`);
  }
}

fetchProducts()
  .then((prods) => console.log(prods.map((prod) => prod.title)))
  .catch((err) => console.error(err.message));
