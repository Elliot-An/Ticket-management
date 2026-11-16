import { NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";

const STATUS_MAP = {
  new: "New",
  in_progress: "In Progress",
  resolved: "Resolved",
  escalated: "Escalated",
} as const;
type Status = keyof typeof STATUS_MAP;

type UpdateTicketInput = {
  status?: unknown;
};

type RouteContext = {
  params: Promise<{ id: string }>;
};

function isStatus(value: unknown): value is Status {
  return typeof value === "string" && value in STATUS_MAP;
}

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;
  if (!id) {
    return NextResponse.json({ error: "Ticket id is required" }, { status: 400 });
  }

  let input: UpdateTicketInput;
  try {
    input = (await request.json()) as UpdateTicketInput;
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON" }, { status: 400 });
  }

  if (!isStatus(input.status)) {
    return NextResponse.json(
      { error: "A valid status is required: new, in_progress, resolved, or escalated" },
      { status: 400 },
    );
  }

  try {
    const { data, error } = await getSupabaseClient()
      .from("tickets")
      .update({ status: STATUS_MAP[input.status], updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update ticket: ${error.message}`);
    }

    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update ticket";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
