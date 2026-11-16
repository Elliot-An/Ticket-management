import { NextResponse } from "next/server";
import { parseTicketFromText, type ParsedTicket } from "@/src/lib/gemini";
import { getSupabaseClient } from "@/lib/supabase";

type TelegramMessage = {
  message_id: number;
  text: string;
  chat: {
    id: number;
  };
};

type TelegramUpdate = {
  message?: TelegramMessage;
};

const MAX_PROCESS_ATTEMPTS = 2;

async function createTicket(ticket: ParsedTicket & {
  source: "telegram";
  telegram_message_id: number;
  original_text: string;
}): Promise<{ id: string | number }> {
  const ticketData = {
    title: ticket.title,
    description: ticket.description,
    category: ticket.category,
    source: ticket.source,
    telegram_message_id: ticket.telegram_message_id,
    original_text: ticket.original_text,
    priority: ticket.priority === "Urgent" ? "Critical" : ticket.priority,
  };
  const { data, error } = await getSupabaseClient()
    .from("tickets")
    .insert(ticketData)
    .select("id")
    .single();

  if (error) {
    throw new Error(`Failed to create Telegram ticket: ${error.message}`);
  }

  return data;
}

async function sendTelegramMessage(chatId: number, text: string) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) {
    throw new Error("Missing TELEGRAM_BOT_TOKEN environment variable");
  }

  const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text }),
  });

  if (!response.ok) {
    throw new Error(`Telegram sendMessage request failed with status ${response.status}`);
  }
}

async function processMessage(message: TelegramMessage) {
  const parsed = await parseTicketFromText(message.text);

  const ticket = await createTicket({
    ...parsed,
    source: "telegram",
    telegram_message_id: message.message_id,
    original_text: message.text,
  });

  await sendTelegramMessage(
    message.chat.id,
    `Đã ghi nhận ticket #${ticket.id}: ${parsed.title}\nMức độ ưu tiên: ${parsed.priority}`,
  );
}

export async function POST(request: Request) {
  const expectedSecret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (expectedSecret && request.headers.get("x-telegram-bot-api-secret-token") !== expectedSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let update: TelegramUpdate;

  try {
    update = (await request.json()) as TelegramUpdate;
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON" }, { status: 400 });
  }

  const message = update.message;
  if (!message?.text) {
    return NextResponse.json({ ok: true });
  }

  let lastError: unknown;
  for (let attempt = 1; attempt <= MAX_PROCESS_ATTEMPTS; attempt += 1) {
    try {
      await processMessage(message);
      return NextResponse.json({ ok: true });
    } catch (error: unknown) {
      lastError = error;
      console.error(
        `Failed to process Telegram message (attempt ${attempt}/${MAX_PROCESS_ATTEMPTS})`,
        error,
      );
    }
  }

  console.error("Failed to process Telegram message after retry", lastError);

  try {
    await sendTelegramMessage(
      message.chat.id,
      "Xin lỗi, hệ thống chưa thể xử lý yêu cầu của bạn lúc này. Vui lòng thử lại sau.",
    );
  } catch (notificationError: unknown) {
    console.error("Failed to send Telegram error message", notificationError);
  }

  return NextResponse.json({ ok: true });
}
