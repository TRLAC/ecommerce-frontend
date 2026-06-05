// features/Cart/types.ts

export interface CartItem {
  cartItemId: number;
  productId: number;
  productName: string;
  productImageUrl: string | null;
  productPrice: number;
  productBrand: string;
  quantity: number;
  totalPrice: number;
}

export interface CartResponse {
  cartId: number;
  userId: number;
  cartItems: CartItem[];
  totalItems: number;
  totalAmount: number;
}

export interface CreateCartRequest {
  productId: number;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}
