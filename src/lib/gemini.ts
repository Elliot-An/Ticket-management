const DEFAULT_MODEL = "gemini-3-flash-preview";

export type ParsedTicket = {
  title: string;
  description: string;
  priority: string;
  category: string;
  needs_review: boolean;
};

type GeminiResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
};

function buildTicketPrompt(text: string): string {
  return `Bạn là hệ thống phân loại ticket hỗ trợ IT. Đọc nội dung tiếng Việt và chỉ trả về một JSON hợp lệ, không markdown, với đúng các trường:
{
  "title": "tiêu đề ngắn gọn",
  "description": "mô tả vấn đề",
  "priority": "Low | Medium | High | Urgent",
  "category": "Networking | Hardware | Software | Account | Other",
  "needs_review": false
}

Ví dụ 1:
Nội dung: "Máy tính của tôi không kết nối được Wi-Fi từ sáng nay."
JSON: {"title":"Không kết nối được Wi-Fi","description":"Máy tính không thể kết nối Wi-Fi từ sáng nay.","priority":"High","category":"Networking","needs_review":false}

Ví dụ 2:
Nội dung: "Xin cấp lại mật khẩu tài khoản email vì tôi quên mật khẩu."
JSON: {"title":"Cấp lại mật khẩu email","description":"Người dùng quên mật khẩu và cần được cấp lại quyền truy cập email.","priority":"Medium","category":"Account","needs_review":false}

Ví dụ 3:
Nội dung: "Phần mềm kế toán bị treo khi mở báo cáo tháng, đang cần báo cáo gấp."
JSON: {"title":"Phần mềm kế toán bị treo","description":"Phần mềm kế toán bị treo khi mở báo cáo tháng và cần xử lý gấp.","priority":"Urgent","category":"Software","needs_review":true}

Nội dung cần phân loại:
${text}`;
}

function fallbackTicket(text: string): ParsedTicket {
  return {
    title: text.trim().slice(0, 120) || "Ticket cần xem xét",
    description: text.trim(),
    priority: "Medium",
    category: "Other",
    needs_review: true,
  };
}

function extractJsonText(text: string): string {
  const fencedMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  return (fencedMatch?.[1] ?? text).trim();
}

function isParsedTicket(value: unknown): value is ParsedTicket {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const ticket = value as Record<string, unknown>;
  return (
    typeof ticket.title === "string" &&
    typeof ticket.description === "string" &&
    typeof ticket.priority === "string" &&
    typeof ticket.category === "string" &&
    typeof ticket.needs_review === "boolean"
  );
}

export async function parseTicketFromText(text: string): Promise<ParsedTicket> {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL ?? DEFAULT_MODEL;

  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY environment variable");
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1/models/${encodeURIComponent(model)}:generateContent`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: buildTicketPrompt(text) }] }],
        generationConfig: { responseMimeType: "application/json" },
      }),
    },
  );

  if (!response.ok) {
    throw new Error(`Gemini API request failed with status ${response.status}`);
  }

  const data = (await response.json()) as GeminiResponse;
  const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!generatedText) {
    return fallbackTicket(text);
  }

  try {
    const parsed = JSON.parse(extractJsonText(generatedText)) as unknown;
    return isParsedTicket(parsed) ? parsed : fallbackTicket(text);
  } catch {
    return fallbackTicket(text);
  }
}
