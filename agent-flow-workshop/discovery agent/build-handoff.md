# Build Handoff: Hiển thị người xử lý ticket

## Bối cảnh

Ticket được tạo qua Portal hoặc Telegram. IT Lead và IT Support cần nhìn thấy
rõ trách nhiệm xử lý của từng ticket. Mỗi ticket chỉ có một người xử lý chính.

## Yêu cầu triển khai

1. Bổ sung hoặc sử dụng trường người xử lý trên ticket.
2. Hiển thị trường này ở các màn hình danh sách/chi tiết ticket liên quan.
3. Giới hạn thao tác gán và thay đổi cho IT Lead.
4. Cho phép IT Lead thay đổi người xử lý bất cứ lúc nào.
5. Sắp xếp ticket chưa gán và khác trạng thái `new` lên đầu danh sách, đồng
   thời hiển thị border đỏ.
6. Hiển thị cảnh báo khi người xử lý không còn khả dụng, nhưng không tự động
   gán người thay thế.

## Acceptance Criteria bàn giao

- Quyền gán/thay đổi được kiểm tra ở phía xử lý yêu cầu, không chỉ ẩn giao diện.
- Một ticket không thể có nhiều người xử lý chính.
- Quy tắc ưu tiên và border đỏ chỉ áp dụng cho ticket chưa gán, khác trạng thái
  `new`.
- Thay đổi người xử lý được phản ánh trên các màn hình hiển thị ticket.
- Không có cơ chế tự động chuyển ticket khi người xử lý không còn khả dụng.

## Kênh và tương thích

- Không thay đổi cách tạo ticket qua Portal hoặc Telegram.
- Tính năng phải áp dụng cho ticket được tạo từ cả hai kênh.

## Dependencies

PM xác nhận không có dependency bổ sung.

## Risks và điểm cần xác minh khi triển khai

- Cần xác định nguồn dữ liệu dùng để biết người xử lý không còn khả dụng; PM
  chưa chốt chi tiết này.
- Cần bảo đảm quy tắc sắp xếp ticket chưa gán không làm mất các tiêu chí sắp
  xếp hiện có.
- Cần kiểm thử quyền IT Lead và IT Support ở cả giao diện và API/backend.

## Trạng thái

Phạm vi và quyết định nghiệp vụ đã được PM LOCK. Các điểm trong mục “Risks và
điểm cần xác minh” là vấn đề triển khai, không phải yêu cầu đã được tự suy
đoán.
