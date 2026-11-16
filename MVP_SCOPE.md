# IT Support Ticket Tool v0.1

## 1. Mục tiêu

Thay thế việc dùng Telegram group để theo dõi yêu cầu IT của một team 5-10 người.
Mục tiêu cốt lõi của v0.1:

> Mỗi yêu cầu trở thành một ticket có người phụ trách, trạng thái và lịch sử rõ ràng.

v0.1 là công cụ nội bộ cho **một team**, **một workspace**, tối đa khoảng 10 người dùng.

## 2. User stories

1. **Là người dùng nội bộ, tôi muốn tạo ticket với mô tả và mức độ ưu tiên để team IT biết chính xác vấn đề cần xử lý.**
2. **Là thành viên IT, tôi muốn xem danh sách và lọc ticket theo trạng thái, mức độ ưu tiên và người phụ trách để biết việc nào cần làm tiếp theo.**
3. **Là thành viên IT, tôi muốn nhận ticket và cập nhật trạng thái để tránh việc bị bỏ sót hoặc nhiều người xử lý trùng nhau.**
4. **Là người báo lỗi, tôi muốn xem chi tiết ticket và thêm comment để trao đổi trong cùng một nơi thay vì tìm lại trong Telegram.**
5. **Là team lead, tôi muốn xem lịch sử cập nhật và các thống kê đếm cơ bản để biết workload và ticket tồn đọng.**

## 3. Phạm vi chức năng

### 3.1. Ticket

Các trường bắt buộc:

- `title`
- `description`
- `requester`
- `priority`: `low`, `medium`, `high`, `critical`

Các trường hệ thống:

- `id`
- `status`: `new`, `in_progress`, `resolved`, `escalated`
- `assignee` (có thể để trống khi mới tạo)
- `createdAt`
- `updatedAt`

### 3.2. Màn hình

- **Ticket list**: hiển thị ticket mới nhất trước, badge trạng thái và priority.
- **Create ticket**: form tạo ticket.
- **Ticket detail**: thông tin ticket, chọn assignee/status, danh sách comment, form thêm comment.
- **Basic summary**: tổng số ticket theo trạng thái; có thể đặt ngay trên ticket list.

### 3.3. Tìm kiếm và lọc

- Tìm theo `title` và `description`.
- Lọc theo `status`, `priority`, `assignee`.
- Không yêu cầu full-text search hoặc tìm kiếm nâng cao trong v0.1.

### 3.4. Người dùng

Để giữ scope một ngày:

- Dùng danh sách thành viên IT được cấu hình trong database/seed.
- Không xây dựng đăng ký, reset password, SSO hoặc phân quyền phức tạp.
- Nếu cần nhận diện người tạo, v0.1 có thể dùng tên/email nhập trong form hoặc user nội bộ được seed sẵn.
- Không có multi-tenant và không có customer portal.

## 4. Tech stack tối giản

Repo hiện đã có Next.js, React, TypeScript và Tailwind CSS. Giữ nguyên nền tảng này:

- **Framework**: Next.js 16 App Router
- **Language**: TypeScript
- **UI**: React + Tailwind CSS hiện có
- **API/server logic**: Next.js Route Handlers hoặc Server Actions; ưu tiên một cách nhất quán
- **Database**: PostgreSQL
- **Validation**: validation thủ công ở server; chưa thêm thư viện nếu không cần
- **Auth**: không làm auth đầy đủ trong v0.1; chỉ dùng team nội bộ và danh sách thành viên seed sẵn
- **Model**: Gemini 3 Flash Preview

### Nguyên tắc kỹ thuật

- Mọi mutation phải validate ở server, không tin dữ liệu từ client.
- API phải trả lỗi HTTP rõ ràng, không silently ignore lỗi database.
- Không expose database hoặc secret ra client.
- Dùng UTC để lưu timestamp và format ở UI.
- Không tích hợp Telegram trong v0.1.

## 5. Data model tối thiểu

### `users`

- `id`
- `name`
- `email` (optional)
- `role`: `requester` hoặc `it`
- `createdAt`

### `tickets`

- `id`
- `title`
- `description`
- `requesterId`
- `assigneeId` (nullable)
- `priority`
- `status`
- `createdAt`
- `updatedAt`

### `comments`

- `id`
- `ticketId`
- `authorId`
- `body`
- `createdAt`

Nếu cần rút ngắn thời gian build, lịch sử thay đổi status/assignee có thể chưa cần bảng riêng; timestamp và comment là đủ cho v0.1. Không được đánh đổi việc lưu trạng thái hiện tại.

## 6. Ngoài phạm vi v0.1

- Telegram bot hoặc đồng bộ hai chiều với Telegram
- Email notification
- SLA, escalation, on-call schedule
- Attachment/file upload
- Knowledge base
- AI auto-classification hoặc auto-reply
- Dashboard/reporting nâng cao
- Native mobile app
- Multi-team, multi-tenant, granular permissions
- Audit log đầy đủ cho từng field
- Recurring ticket và automation rules

## 7. Definition of Done

MVP v0.1 được xem là hoàn thành khi tất cả tiêu chí sau đạt:

### Luồng nghiệp vụ

- [ ] Người dùng có thể mở trang và tạo một ticket hợp lệ.
- [ ] Ticket mới xuất hiện trong danh sách ngay sau khi tạo.
- [ ] Ticket hiển thị title, requester, priority, status, assignee và thời gian cập nhật.
- [ ] Thành viên IT có thể assign ticket cho một thành viên.
- [ ] Thành viên IT có thể chuyển ticket qua `new`, `in_progress`, `resolved`, `escalated`.
- [ ] Người dùng có thể mở chi tiết ticket và thêm comment.
- [ ] Comment được lưu và hiển thị theo thứ tự thời gian.
- [ ] Refresh trang không làm mất ticket, comment hoặc trạng thái.

### Tìm kiếm và theo dõi

- [ ] Có thể lọc ticket theo status, priority và assignee.
- [ ] Có thể tìm ticket theo title hoặc description.
- [ ] Có số đếm ticket theo từng status ở màn hình danh sách.
- [ ] Ticket mới mặc định được sắp xếp trước ticket cũ.

### Chất lượng và an toàn

- [ ] Server từ chối title/description rỗng và dữ liệu enum không hợp lệ.
- [ ] Lỗi database/API hiển thị thành lỗi rõ ràng, không trả về success giả.
- [ ] API key/secret (nếu có) không xuất hiện trong client bundle hoặc source control.
- [ ] `npm run lint` chạy thành công.
- [ ] `npm run build` chạy thành công.
- [ ] Có test thủ công cho: tạo ticket, assign, đổi status, comment, filter và refresh.
- [ ] Có dữ liệu seed để demo team 5-10 người trong môi trường local.

### Tiêu chí demo

Một người không cần giải thích thêm có thể hoàn thành luồng:

1. Tạo ticket “Không truy cập được VPN”.
2. Đặt priority là `high`.
3. Assign cho một thành viên IT.
4. Chuyển status sang `in_progress`.
5. Thêm comment cập nhật.
6. Chuyển sang `resolved` rồi `escalated`.
7. Tìm lại ticket bằng search/filter sau khi reload trang.

## 8. Thứ tự triển khai đề xuất trong một ngày

1. Tạo schema SQLite, migration/khởi tạo database và seed users.
2. Tạo server functions/API cho ticket và comment.
3. Làm ticket list + summary.
4. Làm create ticket.
5. Làm ticket detail, assign, status và comment.
6. Thêm search/filter.
7. Chạy lint/build và thực hiện kịch bản demo.

Nếu hết thời gian, giữ lại các phần bắt buộc theo thứ tự: **create ticket → list/detail → assign/status → comment → filter**. Bỏ summary nâng cao trước, không bỏ persistence hoặc status.

## 9. Hướng dẫn cho AI Agent

Khi triển khai đặc tả này:

- Đọc code hiện tại trước khi sửa và giữ nguyên convention của repo.
- Chỉ mở rộng scope khi có yêu cầu rõ ràng.
- Ưu tiên implementation đơn giản, dễ chạy local và dễ thay thế database về sau.
- Không tự thêm Telegram integration, auth provider, notification service hoặc AI feature.
- Sau mỗi nhóm thay đổi, chạy validation nhỏ nhất phù hợp; cuối cùng chạy `npm run lint` và `npm run build`.
- Nếu có mâu thuẫn giữa tài liệu và code hiện tại, dừng để nêu rõ mâu thuẫn thay vì âm thầm đổi phạm vi.
