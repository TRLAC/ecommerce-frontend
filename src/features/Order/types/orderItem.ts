export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  productImage: string;
  variantId?: number;
  variantName?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}
