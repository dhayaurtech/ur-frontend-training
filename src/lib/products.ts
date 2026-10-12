import products from '../data/products.json' with { type: 'json' };
import type { LocalProduct } from '../types/product';
import type { LocalProductCategory } from '../types/product';

const localproducts = products as LocalProduct[];

export function searchProducts(
  product: LocalProduct[],
  query: string,
): LocalProduct[] {
  const searchProducts = query.trim().toLowerCase();

  if (searchProducts === '') {
    return [];
  }

  const searchProds = product.filter(
    (prod) =>
      prod.name.toLowerCase().includes(searchProducts) ||
      prod.category.toLowerCase().includes(searchProducts),
  );

  return searchProds;
}

// console.log("Search products : ", searchProducts(localproducts, "Electronics"));
// console.log("Search products : ", searchProducts(localproducts, "mouse"));

export function filterProductsByCategory(
  products: LocalProduct[],
  category: LocalProductCategory,
): LocalProduct[] {
  const categoryName: string = category.trim().toLowerCase();

  if (categoryName === 'all') {
    return products;
  }

  const filterProds: LocalProduct[] = products.filter(
    (product) => product.category.toLowerCase() === categoryName,
  );

  return filterProds;
}

// console.log(
//   "Filter products : ",
//   filterProductsByCategory(localproducts, "all"),
// );

export function sortProducts(
  products: LocalProduct[],
  field: string,
  direction: string,
): LocalProduct[] {
  const sortDirection = direction.trim().toLowerCase();
  const sortField = field.trim().toLowerCase();

  if (sortDirection === 'ascending') {
    if (sortField === 'name') {
      const sortByName: LocalProduct[] = products.toSorted((a, b) =>
        a.name.localeCompare(b.name),
      );
      return sortByName;
    } else if (sortField === 'price') {
      const sortByPrice: LocalProduct[] = products.toSorted(
        (a, b) => a.price - b.price,
      );
      return sortByPrice;
    } else if (sortField === 'createdat') {
      const sortByDate: LocalProduct[] = products.toSorted(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
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
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
      return sortByDate;
    }
  }

  return products;
}

// console.log(
//   "Sorted Products by name : ",
//   sortProducts(localproducts, "name", "descending"),
// );
// console.log(
//   "Sorted Products by price : ",
//   sortProducts(localproducts, "price", "ascending"),
// );
// console.log(
//   "Sorted Products by createdAt : ",
//   sortProducts(localproducts, "createdAt", "descending"),
// );

export function getInventorySummary(products: LocalProduct[]): object {
  const totalProducts: number = products.length;
  const activeProducts: number = products.filter(
    (product) => product.isActive,
  ).length;
  const outOfStock: number = products.filter(
    (product) => product.stock === 0,
  ).length;
  const totalStockValue: number = products.reduce(
    (acc, cur) => acc + cur.price * cur.stock,
    0,
  );

  return { totalProducts, activeProducts, outOfStock, totalStockValue };
}

// console.log("Inventory Summary : ", getInventorySummary(localproducts));

export function formatPrice(amount: number): string {
  const price = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount);

  return price;
}

// console.log(formatPrice(1299));
// console.log(formatPrice(50.25));

function throwCatchError(errMsg: string): never {
  throw new Error(errMsg);
}

type productCategory = 'beauty' | 'fragrances' | 'furniture' | 'groceries';

interface Product {
  id: number;
  title: string;
  category: productCategory;
  price: number;
}

type product = {
  products: Product[];
};

function isProduct(value: unknown): value is product {
  return (
    typeof value === 'object' &&
    value !== null &&
    'products' in value &&
    Array.isArray(value.products)
  );
}

export async function fetchProducts(url: string): Promise<Product[]> {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throwCatchError(`Request failed : ${response.status}`);
    }

    const data: unknown = await response.json();
    if (!isProduct(data)) {
      throwCatchError('Invalid product');
    }

    return data.products;
  } catch (error) {
    throwCatchError(`Failed to fetch products : ${error}`);
  }
}

fetchProducts('https://dummyjson.com/products')
  .then((prods) => console.log(prods.map((prod) => prod)))
  .catch((err) => console.error(err.message));
