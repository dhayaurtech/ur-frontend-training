export type CartProduct = {
  _id: string;
  title: string;
  price: number;
  thumbnail: string;
};

export type CartItem = {
  product: CartProduct;
  quantity: number;
};

export type CartResponse = {
  cartItem: CartItem[];
  cartTotal: number;
};