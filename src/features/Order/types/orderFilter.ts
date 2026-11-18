// BE chỉ nhận phân trang (Pageable) cho GET /api/orders, chưa lọc theo status.
export interface OrderQuery {
  page?: number;
  size?: number;
  sort?: string; // vd "createdAt,desc"
}
