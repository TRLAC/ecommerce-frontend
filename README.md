# E-commerce Frontend

Giao diện cho shop điện tử (demo cho CV / phỏng vấn): khách duyệt sản phẩm, giỏ hàng, đặt hàng, thanh toán giả lập, theo dõi đơn, yêu cầu hoàn tiền; admin quản lý đơn hàng, giao hàng, hoàn tiền, sản phẩm, danh mục, người dùng.

Backend (Spring Boot, monolith) nằm ở repo riêng: `<link repo BE>`. FE này chỉ gọi REST API của BE.

## Công nghệ

- React + TypeScript (strict, không dùng `any`), Vite
- Tailwind CSS v4 (không viết CSS riêng)
- React Router (route lồng nhau, guard theo vai trò)
- TanStack Query (gọi API, cache, invalidate sau mutation)
- Zustand (auth store)
- Axios (một `apiClient` duy nhất: gắn JWT, tự refresh khi 401)
- react-hook-form (form hồ sơ, đăng nhập, đăng ký), lucide-react (icon)

## Chạy dự án

Yêu cầu: Node.js 20.19+ (hoặc 22+) và BE đang chạy ở `http://localhost:8080`.

```bash
npm install
cp .env.example .env     # Windows: copy .env.example .env
npm run dev              # http://localhost:5173
```

Biến môi trường (`.env`, không commit):

| Biến | Mặc định | Ý nghĩa |
|---|---|---|
| `VITE_API_URL` | `http://localhost:8080/api` | Base URL của BE |

Các lệnh khác: `npm run build` (typecheck + build), `npm run preview`.

BE cần bật CORS cho `http://localhost:5173` và `allowCredentials` (refresh token đi qua cookie).

## Tài khoản admin để thử

Trang đăng ký chỉ tạo tài khoản `ROLE_USER`. Để có admin:

1. Đăng ký một tài khoản trên web.
2. Trong SQL Server, gán thêm role admin cho tài khoản đó:

```sql
INSERT INTO user_roles (user_id, role_id)
SELECT u.user_id, r.role_id
FROM users u, roles r
WHERE u.email = '<email vừa đăng ký>' AND r.role_name = 'ROLE_ADMIN';
```

3. Đăng xuất, đăng nhập lại (để token mang quyền mới) rồi vào `/admin`.

## Cấu trúc thư mục

Chia theo tính năng (`features/`), mỗi tính năng tách 3 lớp: **api** (gọi HTTP) → **hooks** (TanStack Query) → **components/pages** (UI).

```
src/
  app/            router, queryClient
  layouts/        MainLayout (cửa hàng), AdminLayout (sidebar admin)
  shared/
    api/          apiClient (base URL, gắn JWT, xử lý 401 + refresh)
    components/   Button, Toaster, PageLoader, ...
    lib/          toast
    utils/        format (VND, ngày), getErrorMessage
  features/
    auth/         đăng nhập, đăng ký, store, guard theo role
    Product/      danh sách + lọc + phân trang, chi tiết
    Cart/  Checkout/  Order/  Payment/  Refund/  Profile/
    Admin/        Dashboard, Orders, Refunds, Products, Categories, Users
```

## Route chính

| Đường dẫn | Ai vào được | Màn hình |
|---|---|---|
| `/`, `/products/:id` | Mọi người | Danh sách / chi tiết sản phẩm |
| `/login`, `/register` | Khách | Đăng nhập / đăng ký |
| `/cart`, `/checkout` | Đã đăng nhập | Giỏ hàng, đặt hàng |
| `/payment/gateway` | Đã đăng nhập | Cổng thanh toán giả lập |
| `/orders`, `/orders/:id` | Đã đăng nhập | Lịch sử và chi tiết đơn, yêu cầu hoàn tiền |
| `/profile` | Đã đăng nhập | Hồ sơ (tên, email, SĐT, địa chỉ, avatar) |
| `/admin/*` | Chỉ `ROLE_ADMIN` | Tổng quan, đơn hàng, hoàn tiền, sản phẩm, danh mục, người dùng |

## Luồng Order → Payment → Shipping → Refund

Trạng thái **Order** và **Payment** tách riêng (một đơn có thể có nhiều lần thanh toán). Mọi đổi trạng thái đều đi qua `*StatusTransition.canTransition(...)` ở BE; FE chỉ hiện nút khớp với trạng thái hiện tại (`features/Admin/utils/adminRules.ts`).

**Đơn online (MoMo, VNPAY, ...):**
`PENDING → PAID → PROCESSING → SHIPPED → DELIVERED`
Huỷ khi còn `PENDING`. Đã `PAID` có thể yêu cầu hoàn tiền (`→ REFUNDED`).

**Đơn COD:**
`PENDING → CONFIRMED → PROCESSING → SHIPPED → DELIVERED → PAID` (bước cuối là "đã thu tiền mặt").

**Giao hàng (Shipping):** `PENDING → PROCESSING → SHIPPING → DELIVERED`, hoặc `SHIPPING → FAILED → RETURNED`.
- Các bước `PROCESSING`, `SHIPPED`, `DELIVERED` của đơn được cập nhật *thông qua* trạng thái giao hàng.
- Khi hàng giao thất bại và về kho (`RETURNED`): đơn chuyển `CANCELLED`, tồn kho được cộng lại; đơn online đã trả tiền tự có yêu cầu hoàn tiền chờ admin xử lý.

**Hoàn tiền (Refund):** `PENDING → APPROVED → COMPLETED` (hoặc `PENDING → REJECTED`). Hoàn toàn phần, gắn với một payment. Hoàn tất thì payment thành `REFUNDED`.

Cổng thanh toán là **giả lập**, không có tiền thật.

## Quyết định thiết kế

- **Một nơi gọi API:** `shared/api/apiClient.ts` đặt base URL, gắn `Authorization: Bearer`, và khi gặp 401 thì gọi `/auth/refresh` một lần rồi thử lại request (có hàng đợi để nhiều request 401 cùng lúc chỉ refresh một lần).
- **Refresh token trong cookie** (BE set, `httpOnly`), access token chỉ giữ trong bộ nhớ, không lưu localStorage.
- **Phân trang:** chuẩn hoá qua `normalizePage` (hỗ trợ cả dạng `{content, page: {...}}` lẫn dạng Spring mặc định).
- **Ảnh sản phẩm:** FE không tự ghép URL, dùng URL đầy đủ BE trả về.
- **Nút xác nhận 2 bước** cho các thao tác đổi trạng thái của admin để tránh bấm nhầm.

## Giới hạn đã biết (do demo / BE)

- Thanh toán và hoàn tiền giả lập; mỗi giao dịch chỉ xin hoàn tiền một lần.
- Trang Người dùng chỉ để xem (BE chưa có API sửa/khoá tài khoản).
- Chưa có API xoá ảnh sản phẩm; sửa sản phẩm không xoá được thông số đã nhập (BE bỏ qua giá trị rỗng).
- Chưa có review/đánh giá sản phẩm.