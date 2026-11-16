import { NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";

const PRIORITIES = ["Low", "Medium", "High", "Critical"] as const;
const SOURCES = ["portal", "telegram"] as const;
type Priority = (typeof PRIORITIES)[number];
type Source = (typeof SOURCES)[number];

type CreateTicketInput = {
  title?: unknown;
  description?: unknown;
  source?: unknown;
  reporter_name?: unknown;
  priority?: unknown;
};

function normalizePriority(value: unknown): Priority | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  return PRIORITIES.find((priority) => priority.toLowerCase() === value.toLowerCase());
}

function isSource(value: unknown): value is Source {
  return typeof value === "string" && SOURCES.includes(value as Source);
}

export async function GET() {
  try {
    const { data, error } = await getSupabaseClient()
      .from("tickets")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Failed to list tickets: ${error.message}`);
    }

    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to list tickets";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  let input: CreateTicketInput;

  try {
    input = (await request.json()) as CreateTicketInput;
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON" }, { status: 400 });
  }

  if (
    typeof input.title !== "string" ||
    !input.title.trim() ||
    typeof input.description !== "string" ||
    !input.description.trim() ||
    !isSource(input.source) ||
    !normalizePriority(input.priority)
  ) {
    return NextResponse.json(
      { error: "title, description, source, and a valid priority are required" },
      { status: 400 },
    );
  }

  try {
    const { data, error } = await getSupabaseClient()
      .from("tickets")
      .insert({
        title: input.title.trim(),
        description: input.description.trim(),
        source: input.source,
        reporter_name:
          typeof input.reporter_name === "string" ? input.reporter_name.trim() || null : null,
        priority: normalizePriority(input.priority),
        status: "New",
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create ticket: ${error.message}`);
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create ticket";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
