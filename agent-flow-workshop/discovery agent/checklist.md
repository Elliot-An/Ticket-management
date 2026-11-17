
# Discovery Checklist

## Status Definitions

- CONFIRMED: PM đã xác nhận rõ ràng.
- PARTIAL: PM mới cung cấp một phần thông tin.
- UNCONFIRMED: Chưa có thông tin xác nhận.
- REJECTED: PM đã bác bỏ thông tin trước đó.

Chỉ CONFIRMED được tính vào Exit Criteria.

## Phase 1: DISCOVER

- [ ] Pain point: Vấn đề người dùng đang gặp phải.
- [ ] Current state: Quy trình hoặc tình trạng hiện tại.
- [ ] Target state: Kết quả người dùng mong muốn.
- [ ] Primary user: Người dùng chính.

### Exit Criteria
- Ít nhất 3/4 tiêu chí ở trạng thái CONFIRMED.
- Agent phải báo cáo checklist trước khi chuyển phase.

## Phase 2: QUESTION

- [ ] Business rules: Quy tắc nghiệp vụ được làm rõ.
- [ ] Edge cases: Các trường hợp ngoại lệ được xem xét.
- [ ] Dependencies: Các phụ thuộc kỹ thuật/nghiệp vụ được xác định.
- [ ] Unresolved questions: Các câu hỏi còn mở được liệt kê.

### Exit Criteria
- Các quy tắc nghiệp vụ quan trọng đã được PM xác nhận.
- Các trường hợp ngoại lệ quan trọng đã được xem xét.
- Dependencies và các vấn đề chưa giải quyết được ghi nhận rõ ràng.

## Phase 3: LOCK

- [ ] Scope: Phạm vi tính năng được xác nhận.
- [ ] Out of scope: Những nội dung không triển khai được xác định.
- [ ] Key decisions: Các quyết định quan trọng được PM xác nhận.
- [ ] Acceptance criteria: Tiêu chí chấp nhận được thống nhất.

### Exit Criteria
- PM xác nhận phạm vi và các quyết định quan trọng.
- Không còn mâu thuẫn chưa giải quyết trong phạm vi đã khóa.

## Phase 4: PACKAGE

- [ ] PRD.md được tạo.
- [ ] backlog.md được tạo với Acceptance Criteria.
- [ ] build-handoff.md được tạo.
- [ ] Các tài liệu thống nhất với phạm vi đã LOCK.
- [ ] Dependencies, risks và open questions được ghi nhận.

### Exit Criteria
- Đủ ba tài liệu bàn giao.
- Nội dung không mâu thuẫn với quyết định đã LOCK.
- Các điểm chưa xác nhận không bị trình bày như yêu cầu đã chốt.
