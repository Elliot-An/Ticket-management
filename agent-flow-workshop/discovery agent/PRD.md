# PRD: Hiển thị người xử lý ticket

## Vấn đề

IT Lead hiện không biết ai đang phụ trách từng ticket. Ticket có thể được tạo
qua Portal hoặc Telegram nhưng trách nhiệm xử lý chưa được hiển thị rõ ràng.

## Người dùng

- IT Lead
- IT Support

## Mục tiêu

Hiển thị rõ một người xử lý chịu trách nhiệm cho từng ticket và giúp IT Lead
nhận biết nhanh các ticket chưa được gán.

## Phạm vi

- Mỗi ticket có một người xử lý.
- Hiển thị người xử lý trên ticket.
- Chỉ IT Lead được gán hoặc thay đổi người xử lý.
- IT Lead có thể thay đổi người xử lý bất cứ lúc nào.
- Ticket chưa gán và không ở trạng thái `new` được đưa lên đầu danh sách và
  hiển thị border đỏ.
- Nếu người xử lý không còn khả dụng, hệ thống chỉ cảnh báo; không tự động và
  không bắt buộc gán lại.

## Ngoài phạm vi

PM xác nhận không có nội dung ngoài phạm vi trong đợt này.

## Acceptance Criteria

1. IT Lead có thể gán một người xử lý cho ticket.
2. Chỉ IT Lead có thể thay đổi người xử lý.
3. Người xử lý được hiển thị rõ trên từng ticket.
4. Ticket chưa gán, khác trạng thái `new`, xuất hiện đầu danh sách và có
   border đỏ.
5. Khi người xử lý không còn khả dụng, hệ thống chỉ hiển thị cảnh báo và không
   tự động gán người thay thế.

## Trạng thái Discovery

Phase 1 DISCOVER, Phase 2 QUESTION và Phase 3 LOCK đã hoàn tất với xác nhận
của PM. Không có câu hỏi mở hoặc dependency bổ sung được PM ghi nhận.
