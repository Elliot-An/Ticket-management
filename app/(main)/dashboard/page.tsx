"use client";

import { createClient } from "@supabase/supabase-js";
import { useCallback, useEffect, useMemo, useState } from "react";
import { PRIORITY_STYLES, PRIORITIES, TICKET_STATUSES } from "@/constant";
import type { Priority, Ticket } from "@/types";

type ApiTicket = {
  id: string | number;
  title: string;
  category?: string | null;
  priority: string;
  status: string;
  source?: string | null;
  created_at?: string;
  time?: string;
};

type DashboardTicket = Ticket & {
  source: "portal" | "telegram";
};

const STATUS_VALUES: Record<Ticket["status"], string> = {
  New: "new",
  "In Progress": "in_progress",
  Resolved: "resolved",
};

let browserSupabaseClient: ReturnType<typeof createClient> | null = null;

function getBrowserSupabaseClient() {
  if (browserSupabaseClient) {
    return browserSupabaseClient;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    return null;
  }

  browserSupabaseClient = createClient(url, key);
  return browserSupabaseClient;
}

function formatTime(createdAt?: string, fallback?: string) {
  if (fallback) return fallback;
  if (!createdAt) return "Just now";
  return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(
    new Date(createdAt),
  );
}

function normalizeTicket(ticket: ApiTicket): DashboardTicket {
  const priorityMap: Record<string, Priority> = {
    low: "Low",
    medium: "Medium",
    high: "High",
    critical: "Urgent",
    urgent: "Urgent",
  };
  const statusMap: Record<string, Ticket["status"]> = {
    new: "New",
    "in_progress": "In Progress",
    "In Progress": "In Progress",
    resolved: "Resolved",
    Resolved: "Resolved",
  };

  return {
    id: String(ticket.id),
    title: ticket.title,
    category: ticket.category ?? "General",
    priority: priorityMap[ticket.priority.toLowerCase()] ?? "Medium",
    status: statusMap[ticket.status] ?? "New",
    source: ticket.source === "telegram" ? "telegram" : "portal",
    time: formatTime(ticket.created_at, ticket.time),
  };
}

export default function DashboardPage() {
  const [tickets, setTickets] = useState<DashboardTicket[]>([]);
  const [filter, setFilter] = useState<Priority | "All">("All");
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadTickets = useCallback(async () => {
    try {
      const response = await fetch("/api/tickets", { cache: "no-store" });
      const result = (await response.json()) as ApiTicket[] | { error?: string };
      if (!response.ok || !Array.isArray(result)) {
        throw new Error("error" in result ? result.error : "Unable to load tickets.");
      }

      setTickets(result.map(normalizeTicket));
      setError("");
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load tickets.");
    }
  }, []);

  useEffect(() => {
    let active = true;

    const initialLoad = window.setTimeout(() => {
      void loadTickets();
    }, 0);

    const supabase = getBrowserSupabaseClient();
    const channel = supabase
      ?.channel("tickets")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "tickets" },
        (payload) => {
          if (active) {
            const newTicket = normalizeTicket(payload.new as ApiTicket);
            setTickets((current) =>
              current.some((ticket) => ticket.id === newTicket.id)
                ? current
                : [newTicket, ...current],
            );
          }
        },
      )
      .subscribe((status, subscribeError) => {
        if (
          status === "CHANNEL_ERROR" ||
          status === "TIMED_OUT" ||
          status === "CLOSED"
        ) {
          setError(
            subscribeError?.message ??
              "Supabase Realtime is unavailable. Check the tickets table Realtime publication.",
          );
        }
      });

    return () => {
      active = false;
      window.clearTimeout(initialLoad);
      if (supabase && channel) {
        void supabase.removeChannel(channel);
      }
    };
  }, [loadTickets]);

  const visibleTickets = useMemo(
    () => (filter === "All" ? tickets : tickets.filter((ticket) => ticket.priority === filter)),
    [filter, tickets],
  );

  async function moveTicket(ticket: DashboardTicket, status: Ticket["status"]) {
    setError("");
    setUpdatingId(ticket.id);
    try {
      const response = await fetch(`/api/tickets/${ticket.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: STATUS_VALUES[status] }),
      });
      if (!response.ok) {
        const result = (await response.json()) as { error?: string };
        throw new Error(result.error ?? "Unable to update ticket.");
      }
      setTickets((current) =>
        current.map((currentTicket) =>
          currentTicket.id === ticket.id ? { ...currentTicket, status } : currentTicket,
        ),
      );
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Unable to update ticket.");
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <section className="px-8 py-10 lg:px-12">
      <div className="mb-8 rounded-2xl bg-[#182230] px-7 py-6 text-white shadow-lg">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#f26757]">
              Overview
            </p>
            <h1 className="text-[34px] font-semibold tracking-[-0.04em]">Ticket dashboard</h1>
            <p className="mt-2 text-sm text-slate-300">Manage and track your team&apos;s support requests.</p>
          </div>
          <label className="flex items-center gap-3 text-sm text-slate-300">
            Filter by
            <select
              aria-label="Filter by priority"
              value={filter}
              onChange={(event) => setFilter(event.target.value as Priority | "All")}
              className="h-10 rounded-lg border border-slate-600 bg-[#263547] px-3 font-medium text-white outline-none focus:border-[#f26757]"
            >
              <option>All</option>
              {PRIORITIES.slice().reverse().map((priority) => <option key={priority}>{priority}</option>)}
            </select>
          </label>
        </div>
      </div>

      {error && <p role="alert" className="mb-5 rounded-lg bg-[#fff3f2] px-4 py-3 text-sm text-[#b4453b]">{error}</p>}

      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[["Total tickets", tickets.length], ...TICKET_STATUSES.map((status) => [status, tickets.filter((ticket) => ticket.status === status).length])].map(([label, count]) => (
          <div key={label} className="rounded-xl border border-[#e5e8ec] bg-white p-5">
            <p className="text-xs font-medium text-[#8994a1]">{label}</p>
            <p className="mt-2 text-2xl font-semibold text-[#182230]">{count}</p>
          </div>
        ))}
      </div>

      <div className="grid items-start gap-5 xl:grid-cols-3">
        {TICKET_STATUSES.map((status) => {
          const columnTickets = visibleTickets.filter((ticket) => ticket.status === status);
          return (
            <div key={status} className={`rounded-xl p-3 ${status === "New" ? "bg-[#fff4ed]" : status === "In Progress" ? "bg-[#eef4ff]" : "bg-[#edf9f3]"}`}>
              <div className="flex items-center justify-between px-2 pb-3 pt-1">
                <h2 className="text-sm font-semibold text-[#344054]">{status}</h2>
                <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-white px-2 text-xs font-semibold text-[#8994a1]">{columnTickets.length}</span>
              </div>
              <div className="space-y-3">
                {columnTickets.map((ticket) => (
                  <article key={ticket.id} className="rounded-xl border border-[#e5e8ec] bg-white p-4 shadow-[0_3px_8px_rgba(29,41,57,0.08)]">
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <span className="text-[10px] font-bold tracking-[0.12em] text-[#a1aab5]">#{ticket.id}</span>
                      <span className={`rounded-full px-2 py-1 text-[10px] font-bold ${PRIORITY_STYLES[ticket.priority]}`}>{ticket.priority}</span>
                    </div>
                    <h3 className="mb-4 text-sm font-semibold leading-5 text-[#263547]">{ticket.title}</h3>
                    <div className="flex items-center justify-between border-t border-[#f0f1f3] pt-3">
                      <span className="rounded-md bg-[#f3f5f7] px-2 py-1 text-[10px] font-semibold text-[#7e8997]">{ticket.category}</span>
                      <span className="text-sm" title={ticket.source}>{ticket.source === "telegram" ? "📱" : "🌐"}</span>
                    </div>
                    {status !== "Resolved" && (
                      <button
                        type="button"
                        disabled={updatingId === ticket.id}
                        onClick={() => void moveTicket(ticket, status === "New" ? "In Progress" : "Resolved")}
                        className="mt-4 w-full rounded-lg bg-[#182230] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#263547] disabled:cursor-wait disabled:opacity-60"
                      >
                        {updatingId === ticket.id ? "Updating..." : status === "New" ? "Move to In Progress" : "Resolve"}
                      </button>
                    )}
                  </article>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
