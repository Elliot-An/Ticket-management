import { NextResponse } from "next/server";
import { parseTicketFromText, type ParsedTicket } from "@/src/lib/gemini";
import { getSupabaseClient } from "@/lib/supabase";

type TelegramMessage = {
  message_id: number;
  text: string;
};

type TelegramUpdate = {
  message?: TelegramMessage;
};

async function createTicket(ticket: ParsedTicket & {
  source: "telegram";
  telegram_message_id: number;
  original_text: string;
}) {
  const { error } = await getSupabaseClient().from("tickets").insert({
    ...ticket,
    priority: ticket.priority === "Urgent" ? "Critical" : ticket.priority,
  });

  if (error) {
    throw new Error(`Failed to create Telegram ticket: ${error.message}`);
  }
}

async function processMessage(message: TelegramMessage) {
  const parsed = await parseTicketFromText(message.text);

  await createTicket({
    ...parsed,
    source: "telegram",
    telegram_message_id: message.message_id,
    original_text: message.text,
  });
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

  processMessage(message).catch((error: unknown) => {
    console.error("Failed to process Telegram message", error);
  });

  return NextResponse.json({ ok: true });
}
