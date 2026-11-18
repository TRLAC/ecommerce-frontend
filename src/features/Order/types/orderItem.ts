// Khớp OrderItemResponse của BE
export interface OrderItem {
  orderItemId: number;
  productId: number;
  productName: string;
  productImageUrl: string | null;
  quantity: number;
  priceSnapshot: number;
  subtotal: number;
}
