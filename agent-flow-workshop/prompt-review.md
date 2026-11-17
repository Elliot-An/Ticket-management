# Agent Prompt Review

## 1. Discovery Agent

| Prompt section | Behavior it creates | Why it matters |
|---|---|---|
| ROLE | Đóng vai trò Discovery Agent, chịu trách nhiệm khám phá và làm rõ yêu cầu. | Giới hạn trách nhiệm của Agent, tránh thực hiện công việc triển khai. |
| PHASES | Thực hiện tuần tự DISCOVER → QUESTION → LOCK → PACKAGE. | Đảm bảo quy trình thu thập yêu cầu có cấu trúc. |
| Checklist governance | Kiểm tra các tiêu chí bắt buộc trong từng phase. | Tránh bỏ sót thông tin quan trọng. |
| Phase transition gates | Chỉ chuyển phase khi phase hiện tại đáp ứng điều kiện. | Ngăn Agent chuyển bước quá sớm. |
| Phase checkpoint reports | Báo cáo kết quả sau mỗi phase. | Giúp PM theo dõi và xác nhận tiến độ. |
| Package rules | Tạo PRD, backlog và build-handoff theo cấu trúc quy định. | Đảm bảo đầu ra có cấu trúc và sử dụng được cho Dev Agent. |
| Package governance | Kiểm tra tính đầy đủ và nhất quán của các tài liệu trước khi bàn giao. | Hạn chế handoff thiếu thông tin hoặc mâu thuẫn. |

### Discovery Agent - Key Takeaways

- Checklist governance giúp Agent không bỏ sót câu hỏi và thông tin cần thu thập.
- Phase transition gates kiểm soát thời điểm chuyển bước.
- Phase checkpoint reports giúp con người kiểm tra kết quả từng phase.
- LOCK đảm bảo các quyết định quan trọng phải được PM xác nhận.
- Package governance đảm bảo tài liệu bàn giao đầy đủ và nhất quán.

---

## 2. Dev Agent

| Prompt section | Behavior it creates | Why it matters |
|---|---|---|
| ROLE | Đóng vai trò Dev Agent, chịu trách nhiệm triển khai feature. | Xác định rõ nhiệm vụ của Agent. |
| PHASES | Thực hiện INTAKE → PLAN → BUILD → VERIFY → REPORT. | Đảm bảo quy trình triển khai tuần tự. |
| Artifact-driven | Sử dụng tài liệu handoff làm nguồn thông tin chính thức. | Tránh tự suy diễn yêu cầu từ hội thoại. |
| Scope-lock | Chỉ triển khai nội dung thuộc Locked Scope. | Ngăn Agent tự ý mở rộng phạm vi. |
| Verify-continuous | Kiểm tra kết quả và báo cáo lỗi trong quá trình triển khai. | Đảm bảo kết quả có thể xác minh. |
| Readiness Gate | Kiểm tra 8 tiêu chí trước khi chuyển sang PLAN. | Ngăn Agent BUILD khi đầu vào chưa đầy đủ. |
| Readiness Report | Báo cáo trạng thái từng tiêu chí và kết luận READY / NOT_READY / NEEDS_REMAP. | Giúp PM hiểu rõ mức độ sẵn sàng của handoff. |
| Global constraints | Áp dụng các quy tắc bắt buộc trong toàn bộ quy trình. | Ngăn Agent vi phạm các quyết định và quy tắc đã xác nhận. |

### Dev Agent - Key Takeaways

- Artifact-driven đảm bảo Agent làm việc dựa trên tài liệu chính thức.
- Scope-lock kiểm soát phạm vi triển khai.
- Readiness Gate kiểm soát điều kiện bắt đầu triển khai.
- Verify-continuous đảm bảo kết quả được kiểm tra.
- Global constraints duy trì các quy tắc xuyên suốt mọi phase.

---

## 3. Key Takeaways

### Which prompt section prevents the Agent from making assumptions?

- Discovery Agent: QUESTION và LOCK.
- Dev Agent: Artifact-driven và quy tắc xử lý thông tin mâu thuẫn.

### Which section prevents the Agent from proceeding too early?

- Discovery Agent: Phase transition gates.
- Dev Agent: Readiness Gate.

### Which section ensures the output is verifiable?

- Discovery Agent: Phase checkpoint reports và Package governance.
- Dev Agent: VERIFY và Verify-continuous.

### Which section controls the Agent's scope?

- Discovery Agent: LOCK.
- Dev Agent: Scope-lock.

### Overall Conclusion

An effective Agent requires more than a role description and a list of tasks.

Its prompt should define:

1. Responsibilities.
2. Workflow and phases.
3. Rules and constraints.
4. Conditions for phase transitions.
5. Verification and reporting mechanisms.

The key lesson is that every important behavior should be supported by an explicit instruction or enforcement mechanism in the Agent prompt.