export type Product = {
  id: string;
  name: string;
  sku: string;
  category: ProductCategory;
  price: number;
  stock: number;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ProductCategory =
  | 'Electronics'
  | 'Clothing'
  | 'Books'
  | 'Home'
  | 'Toys';

export type CreateProductInput = Omit<
  Product,
  'id' | 'createdAt' | 'updatedAt'
>;
export type UpdateProductInput = Partial<CreateProductInput>;

export type LocalProductCategory =
  | 'all'
  | 'electronics'
  | 'clothing'
  | 'books'
  | 'home'
  | 'toys';

export type LocalProduct = {
  id: number;
  name: string;
  category: LocalProductCategory;
  price: number;
  stock: number;
  isActive: boolean;
  createdAt: string;
};
