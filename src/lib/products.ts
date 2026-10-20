import { Product } from "@/types/product";

export function searchProducts(product: Product[], query: string): Product[] {
  const searchProducts = query.trim().toLowerCase();

  if (searchProducts === "") {
    return product;
  }

  const searchProds = product.filter(
    (prod) =>
      prod.title.toLowerCase().includes(searchProducts) ||
      prod.category.toLowerCase().includes(searchProducts),
  );

  return searchProds;
}

export function filterProductsByCategory(
  products: Product[],
  category: string,
): Product[] {
  const categoryName: string = category.trim().toLowerCase();

  if (categoryName === "all") {
    return products;
  }

  const filterProds: Product[] = products.filter(
    (product) => product.category.toLowerCase() === categoryName,
  );

  return filterProds;
}

export function sortProducts(
  products: Product[],
  field: string,
  direction: string,
): Product[] {
  const sortDirection = direction.trim().toLowerCase();
  const sortField = field.trim().toLowerCase();

  if (sortDirection === "ascending") {
    if (sortField === "name") {
      const sortByName: Product[] = products.toSorted((a, b) =>
        a.title.localeCompare(b.title),
      );
      return sortByName;
    } else if (sortField === "price") {
      const sortByPrice: Product[] = products.toSorted(
        (a, b) => a.price - b.price,
      );
      return sortByPrice;
    } else if (sortField === "createdat") {
      const sortByDate: Product[] = products.toSorted(
        (a, b) =>
          new Date(a.meta.createdAt).getTime() - new Date(b.meta.createdAt).getTime(),
      );
      return sortByDate;
    }
  } else if (sortDirection === "descending") {
    if (sortField === "name") {
      const sortByName = products.toSorted((a, b) =>
        b.title.localeCompare(a.title),
      );
      return sortByName;
    } else if (sortField === "price") {
      const sortByPrice = products.toSorted((a, b) => b.price - a.price);
      return sortByPrice;
    } else if (sortField === "createdat") {
      const sortByDate = products.toSorted(
        (a, b) =>
          new Date(b.meta.createdAt).getTime() - new Date(a.meta.createdAt).getTime(),
      );
      return sortByDate;
    }
  }

  return products;
}

export function getInventorySummary(products: Product[]) {
  const totalProducts: number = products.length;
  const activeProducts: number = products.filter(
    (product) => product.stock > 0,
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