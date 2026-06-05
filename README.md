# Hệ thống quản lý bán hàng

## Bước 1: Thu thập yêu cầu của khách hàng
- Yêu cầu của khách hàng:
  + Xây dựng một hệ thống quản lý bán hàng cho một quán nước quy mô nhỏ lẻ.
  + Hệ thống cần có các chức năng chính sau:
    * Quản lý sản phẩm: Thêm, sửa, xóa sản phẩm, quản lý danh mục sản phẩm.
    * Quản lý đơn hàng: Tạo đơn hàng, cập nhật trạng thái đơn hàng, xem lịch sử đơn hàng.
    * Quản lý khách hàng: Thêm, sửa, xóa thông tin khách hàng, xem lịch sử mua hàng của khách hàng.
    * Báo cáo doanh thu: Xem báo cáo doanh thu theo ngày, tuần, tháng.
    * Hệ thống cần có giao diện thân thiện, dễ sử dụng.
    * Hệ thống có hỗ trợ thanh toán online, cod.
    * Hệ thống cần có tính bảo mật cao, đảm bảo an toàn thông tin khách hàng và dữ liệu bán hàng.
    * Có xử lý khuyến mãi, giảm giá cho khách hàng, tích điểm thưởng.
    * Đặt hàng không cần đăng nhập, nhưng nếu đăng nhập sẽ có nhiều ưu đãi hơn.
## Bước 2: Phân tích yêu cầu
- Xác định các actor:
  + Khách hàng
  + Quản lý
  + Nhân viên
  + Hệ thống thanh toán
- Xác định các usecase:
  + Khách hàng: Xem sản phẩm, tìm kiếm sản phẩm, đặt hàng, thanh toán, thêm sản phẩm vào giỏ hàng
  + Nhân viên: Quản lý đơn hàng, cập nhật trạng thái
  + Quản lý: Quản lý sản phẩm, quản lý khuyến mãi, xem thống kê
## Bước 3: Thiết kế hệ thống
### Bước 3.1: Thiết kế kiến trúc
- Frontend: react
- Backend: Java Spring-Boot
- CSDL: My SQL
### Bước 3.2: Thiết kế cơ sở dữ liệu
- Các bảng cần thiết: User, Role, Product, ProductVariant, Topping, Cart, CartItem, Category, Inventory, Order, OrderDetail, Promotion, Address, Payment, Review, PointHistory.
- Mối quan hệ giữa các bảng:
  + 1 khách hàng có thể mua nhiều sản phẩm, 1 sản phẩm được mua bởi nhiều khách hàng
  + 1 khách hàng có thể đánh giá nhiều sản phẩm, và có thể đánh giá 1 sản phẩm nhiều lần.
  + 1 User có nhiều địa chỉ
  + 1 danh mục sản phẩm chứa nhiều sản phẩm
  + Khuyến mãi được gắn với từng sản phẩm
  + Khách hàng có thể thêm nhiều sản phẩm vào giỏ hàng.
  + 1 khách hàng có 1 giỏ hàng
  + 1 sản phẩm thì có thể thuộc nhiều giỏ hàng
  + Promotion N —- N Product -> Đề xuất bảng PromotionProduct (promotion_id, product_id)
  + User N —- N Role -> Đề xuất bảng UserRole (user_id, role_id)
  + Product N —- N Topping -> Đề xuất bảng ProductTopping (product_id, topping_id)
  + CartItem N —- N Topping -> Đề xuất bảng CartItemTopping (cart_item_id, topping_id)
  + Order 1 —- N Payment (Thanh toán lỗi thì tạo thanh toán moi)
  + Order 1 —- N OrderDetail
  + OrderDetail 1 --- N OrderDetailTopping
  + User 1 —- N Address
  + Product 1 —- OrderDetail
  + Product 1 —- N ProductVariant
  + ProductVariant 1 —- N Inventory
  + Cart 1 —- N CartItem
  + ProductVariant 1 —- N CartItem
- Các trường dữ liệu:
  + User (id, username, password, email, phone, fullname, status, currentpoint)
  Status = [ ACTIVE, INACTIVE, LOCKED]
  + Role (id, code, name)
  + Product (id, name, images, description, producttype, category_id)
  ProductType = [ MADE_TO_ORDER, READY_MADE]
  + Productvariant (id, product_id, sizename, price)
  + Topping (id, name, price, status)
   Status = [ AVAILABLE, UNAVAILABLE]
  + Cart (id, user_id, sesson_id, status)
   Status = [ ACTIVE, CHECKED_OUT, ABANDONED]
  + CartItem (id, cart_id, product_variant_id, quantity)
  + Category (id, name, code, description)
  + Inventory (id, product_variant_id, quantity, productdate)
  + Order (id, code, totalamount, discountamount, finalamount, status, paymentmethod, note, receivename, receivephone, province, district, ward, detailaddress, user_id)
  Status (PENDING, CONFIRMED, PREPARING, DELIVERING, COMPLETED, CANCELLED)
  + OrderDetail (id, order_id, quantity, product_variant_id, unitprice, totalprice, productname, sizename)
  + OrderDetailTopping (id, order_detail_id, toppingname, toppingprice)
  + Promotion (id, name, code, promotionstart, promotionend, discountpercent, quantity, status, promotiontype)
    PromotionType = [ PRODUCT, ORDER, VOUCHER]
    Status = [ ACTIVE, INACTIVE, EXPIRED]
  + Payment (id, code, method, status, order_id, amount, transaction_id)
  Method = [ Cod, Momo, VNPay, Banking]
  Status = [ Pending, Success, Failed, Refunded]
  + Review (id, rating, comment, product_id, user_id)
  + PointHistory (id, point, order_id, user_id)
  + Address (id, user_id, receivername, receivephone, province, district, ward, detailaddress)
### Bước 3.3: Thiết kế API
- Base URL: api/v1
- Authentication API:
  + POST /auth/login → Đăng nhập (lấy JWT token)
  + POST /auth/register → Đăng ký tài khoản
  + POST /auth/refresh → Làm mới token
  + POST /auth/logout → Đăng xuất
  + POST /auth/forgot → Lấy password reset token
  + POST /auth/reset → Đặt lại password
  + POST /auth/change → Đổi password
- Prorduct API:
  + GET /products → Lấy danh sách sản phẩm
  + GET /products/{id} → Lấy thông tin chi tiết sản phẩm
  + POST /admin/products → Thêm mới sản phẩm (require ADMIN)
  + PUT /admin/products/{id} → Cập nhật sản phẩm (require ADMIN)
  + DELETE /admin/products/{id} → Xóa sản phẩm (require ADMIN)
- Category API:
  + GET /categories → Lấy danh sách danh mục sản phẩm
  + POST /admin/categories → Thêm mới danh mục sản phẩm (require ADMIN)
  + PUT /admin/categories/{id} → Cập nhật danh mục sản phẩm (require ADMIN)
  + DELETE /admin/categories/{id} → Xóa danh mục sản phẩm (require ADMIN)
- Product Variant API:
  + GET /products/{productId}/variants → Lấy danh sách size sản phẩm
  + POST /admin/products/{productId}/variants → Thêm mới size sản phẩm (require ADMIN)
  + PUT /admin/products/{productId}/variants/{id} → Cập nhật size sản phẩm (require ADMIN)
  + DELETE /admin/products/{productId}/variants/{id} → Xóa size sản phẩm (require ADMIN)
- Topping API:
  + GET /toppings → Lấy danh sách topping
  + POST /admin/toppings → Thêm mới topping (require ADMIN)
  + PUT /admin/toppings/{id} → Cập nhật topping (require ADMIN)
  + DELETE /admin/toppings/{id} → Xóa topping (require ADMIN)
- Cart API:
  + GET /cart → Lấy thông tin giỏ hàng của khách hàng (require auth)
  + POST /cart/items → Thêm sản phẩm vào giỏ hàng (require auth)
  + PUT /cart/items/{id} → Cập nhật số lượng sản phẩm trong giỏ hàng (require auth)
  + DELETE /cart/items/{id} → Xóa sản phẩm khỏi giỏ hàng (require auth)
  + DELETE /cart/items → Xóa tất cả sản phẩm khỏi giỏ hàng (require auth)
- Order API:
  + POST /orders → Tạo đơn hàng (require auth)
  + POST /guest/orders -> Tạo đơn hàng cho khách không  
  + GET /orders → Lấy danh sách đơn hàng của khách hàng (require auth)
  + GET /orders/{id} → Lấy thông tin chi tiết đơn hàng (require auth)
  + PUT /admin/orders/{id}/status → Cập nhật trạng thái đơn hàng (require ADMIN)
  + DELETE /orders/{id} → Hủy đơn hàng (require auth)
- Address API:
  + GET /addresses -> Lấy dạnh sách địa chircuar khách hàng
  + POST /addresses -> Thêm địa chỉ mới của khách hàng
  + PUT /addresses -> Cập nhật địa chỉ khách hàng
  + DELETE /addresses -> Xóa địa chỉ khách hàng
- Admin Order API:
  + GET /admin/orders -> Lấy danh sách tất cả các đơn hàng (require ADMIN)
  + GET /admin/orders/{id} -> Lấy thông tin chi tiết đơn hàng (require ADMIN)
  + PUT /admin/orders/{id}/status -> Cập nhật trạng thái đơn hàng (require ADMIN)
  + PUT /admin/orders/{id}/preparing -> Chuẩn bị đơn hàng (require ADMIN)
  + PUT /admin/orders/{id}/delivering -> Đang giao đơn hàng (require ADMIN)
  + PUT /admin/orders/{id}/completed -> Hoàn thành đơn hàng (require ADMIN)
  + DELETE /admin/orders/{id} -> Hủy đơn hàng (require ADMIN)
- Promotion API:
  + GET /promotions → Lấy danh sách khuyến mãi
  + POST /admin/promotions → Thêm mới khuyến mãi (require ADMIN)
  + PUT /admin/promotions/{id} → Cập nhật khuyến mãi (require ADMIN)
  + DELETE /admin/promotions/{id} → Xóa khuyến mãi (require ADMIN)
  + GET /promotions/{id} → Lấy thông tin chi tiết khuyến mãi
  + POST /promotions/validate → Kiểm tra tính hợp lệ của mã khuyến mãi (require auth)
- Payment API:
   + POST /payments/cod -> Thanh toán khi nhận hàng (require auth)
   + POST /guest/payments/cod -> Thanh toán khi nhận hàng cho khách không đăng nhập
   + POST /guest/payments/bank-transfer -> Thanh toán qua chuyển khoản cho khách không đăng nhập
   + POST /payments/bank-tranfer -> Thanh toán qua chuyển khoản (require auth)
   + GET /payments/{id} -> Lấy thông tin chi tiết thanh toán (require auth)
- Review API:
  + POST /products/{productId}/reviews -> Thêm đánh giá cho sản phẩm (require auth)
  + GET /products/{productId}/reviews -> Lấy danh sách đánh giá của sản phẩm
  + GET /users/{userId}/reviews -> Lấy danh sách đánh giá của khách hàng (require auth)
  + DELETE /reviews/{id} -> Xóa đánh giá (require auth)
- Customer API:
  + GET /admin/customers -> Lấy danh sách khách hàng (require ADMIN)
  + GET /admin/customers/{id} -> Lấy thông tin chi tiết khách hàng
  + GET /admin/customers/{id}/orders -> Lấy danh sách đơn hàng của khách hàng (require ADMIN)
- Inventory API:
  + GET /admin/inventory -> Lấy danh sách tồn kho (require ADMIN)
  + POST /admin/inventory -> Thêm mới tồn kho (require ADMIN)
  + PUT /admin/inventory/{id} -> Cập nhật tồn kho (require ADMIN)
  + DELETE /admin/inventory/{id} -> Xóa tồn kho (require ADMIN)
- Dashboard API:
  + GET /admin/dashboard -> Lấy thông tin thống kê doanh thu, số lượng đơn hàng, sản phẩm bán chạy (require ADMIN)
  + GET /admin/dashboard/today -> Lấy thông tin thống kê doanh thu, số lượng đơn hàng, sản phẩm bán chạy trong ngày (require ADMIN)
  + GET /admin/dashboard/revenue-by-day -> Lấy thông tin thống kê doanh thu, số lượng đơn hàng, sản phẩm bán chạy theo ngày (require ADMIN)
  + GET /admin/dashboard/revenue-by-month -> Lấy thông tin thống kê doanh thu, số lượng đơn hàng, sản phẩm bán chạy theo tháng (require ADMIN)
  + GET /admin/dashboard/top-products -> Lấy thông tin thống kê sản phẩm bán chạy nhất (require ADMIN)
  + GET /admin/dashboard/order-statistics -> Thống kê số lượng đơn hàng.
- Point API:
  + GET /points -> Lấy số điểm thưởng của khách hàng (require auth)
  + GET /points/history -> Lấy lịch sử điểm thưởng của khách hàng (require auth)
  + POST /points/redeem -> Đổi điểm thưởng lấy voucher (require auth)
## Bước 4: Lập kế hoạch phát triển
## Bước 5: Phát triển hệ thống 