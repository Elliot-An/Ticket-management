# Backlog: Hiển thị người xử lý ticket

## Epic: Quản lý trách nhiệm xử lý ticket

### Task 1: Hiển thị người xử lý trên ticket

**Mô tả:** Hiển thị rõ một người IT Support đang chịu trách nhiệm cho mỗi
ticket.

**Acceptance Criteria:**

- Mỗi ticket hiển thị một người xử lý.
- IT Lead và IT Support đều xem được người xử lý.
- Ticket chưa gán vẫn được hiển thị nhưng không có người xử lý.

### Task 2: Cho phép IT Lead gán và thay đổi người xử lý

**Mô tả:** Cung cấp quyền gán hoặc thay đổi người xử lý theo đúng quyền hạn.

**Acceptance Criteria:**

- Chỉ IT Lead có thể gán người xử lý.
- Chỉ IT Lead có thể thay đổi người xử lý.
- IT Lead có thể thay đổi người xử lý bất cứ lúc nào.
- Mỗi ticket chỉ có một người xử lý.

### Task 3: Cảnh báo ticket chưa được gán

**Mô tả:** Làm nổi bật ticket chưa gán nhưng đã rời trạng thái `new`.

**Acceptance Criteria:**

- Ticket chưa gán và khác trạng thái `new` được đưa lên đầu danh sách.
- Ticket nêu trên có border đỏ.
- Ticket chưa gán ở trạng thái `new` không bị áp dụng cảnh báo này.

### Task 4: Cảnh báo người xử lý không còn khả dụng

**Mô tả:** Hỗ trợ nhận biết ticket có người xử lý không còn khả dụng mà không
tự động chuyển trách nhiệm.

**Acceptance Criteria:**

- Ticket được hiển thị cảnh báo khi người xử lý không còn khả dụng.
- Hệ thống không tự động gán người thay thế.
- Không bắt buộc IT Lead phải gán lại ngay.

## Dependencies và rủi ro

- PM xác nhận không có dependency bổ sung.
- Việc xác định một người xử lý không còn khả dụng cần dựa trên dữ liệu/trạng
  thái người dùng hiện có; chi tiết nguồn dữ liệu này chưa được PM xác nhận.
