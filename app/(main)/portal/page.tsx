"use client";

import { useState } from "react";
import { Icon } from "@/components/icon";

type TicketForm = {
  title: string;
  description: string;
  priority: string;
  reporter_name: string;
};

const initialForm: TicketForm = {
  title: "",
  description: "",
  priority: "Medium",
  reporter_name: "",
};

export default function PortalPage() {
  const [form, setForm] = useState(initialForm);
  const [submittedId, setSubmittedId] = useState<string | number | null>(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(field: keyof TicketForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submitTicket(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmittedId(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, source: "portal" }),
      });
      const result = (await response.json()) as {
        id?: string | number;
        error?: string;
        message?: string;
      };

      if (!response.ok) {
        throw new Error(result.error ?? result.message ?? "Không thể ghi nhận ticket.");
      }

      if (result.id === undefined || result.id === null) {
        throw new Error("API không trả về mã ticket.");
      }

      setSubmittedId(result.id);
      setForm(initialForm);
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Không thể ghi nhận ticket.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="mx-auto max-w-[920px] px-4 py-8 sm:px-8 sm:py-12 lg:px-12">
      <div className="mb-10 max-w-[600px]">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[#f26757]">
          Need a hand?
        </p>
        <h1 className="text-[34px] font-semibold tracking-[-0.04em] text-[#182230]">
          How can we help you today?
        </h1>
        <p className="mt-3 text-[15px] leading-6 text-[#768292]">
          Tell us a little about your issue and our support team will get back to you shortly.
        </p>
      </div>
      <div className="rounded-2xl border border-[#e5e8ec] bg-white p-5 shadow-[0_8px_30px_rgba(29,41,57,0.04)] sm:p-8">
        {submittedId !== null && (
          <div
            role="status"
            className="mb-7 flex items-center gap-3 rounded-xl border border-[#bfe7d4] bg-[#edfaf3] px-4 py-3 text-sm text-[#22734f]"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#39a875] text-white">
              <Icon name="check" />
            </span>
            Ticket #{submittedId} đã được ghi nhận
          </div>
        )}
        {error && (
          <div
            role="alert"
            className="mb-7 rounded-xl border border-[#f3c4c0] bg-[#fff3f2] px-4 py-3 text-sm text-[#b4453b]"
          >
            {error}
          </div>
        )}
        <form onSubmit={submitTicket} className="space-y-6">
          <div>
            <label htmlFor="title" className="mb-2 block text-sm font-semibold text-[#344054]">
              Title <span className="text-[#f26757]">*</span>
            </label>
            <input
              id="title"
              name="title"
              value={form.title}
              onChange={(event) => updateField("title", event.target.value)}
              required
              placeholder="e.g. I can't connect to the office Wi-Fi"
              className="h-12 w-full rounded-lg border border-[#dfe3e8] px-4 text-sm outline-none transition placeholder:text-[#aeb6c1] focus:border-[#f26757] focus:ring-4 focus:ring-[#f26757]/10"
            />
          </div>
          <div>
            <label htmlFor="description" className="mb-2 block text-sm font-semibold text-[#344054]">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={(event) => updateField("description", event.target.value)}
              placeholder="Please describe what happened and any steps you've already tried..."
              className="min-h-[126px] w-full resize-y rounded-lg border border-[#dfe3e8] p-4 text-sm outline-none transition placeholder:text-[#aeb6c1] focus:border-[#f26757] focus:ring-4 focus:ring-[#f26757]/10"
            />
          </div>
          <div>
            <label htmlFor="priority" className="mb-2 block text-sm font-semibold text-[#344054]">
              Priority
            </label>
            <div className="relative">
              <select
                id="priority"
                name="priority"
                value={form.priority}
                onChange={(event) => updateField("priority", event.target.value)}
                className="h-12 w-full appearance-none rounded-lg border border-[#dfe3e8] bg-white px-4 text-sm outline-none focus:border-[#f26757]"
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Critical</option>
              </select>
              <span className="pointer-events-none absolute right-4 top-4 text-[#84909e]">
                <Icon name="chevron" />
              </span>
            </div>
          </div>
          <div>
            <label htmlFor="reporter_name" className="mb-2 block text-sm font-semibold text-[#344054]">
              Reporter name
            </label>
            <input
              id="reporter_name"
              name="reporter_name"
              value={form.reporter_name}
              onChange={(event) => updateField("reporter_name", event.target.value)}
              placeholder="Your name"
              className="h-12 w-full rounded-lg border border-[#dfe3e8] px-4 text-sm outline-none transition placeholder:text-[#aeb6c1] focus:border-[#f26757] focus:ring-4 focus:ring-[#f26757]/10"
            />
          </div>
          <div className="flex flex-col gap-4 border-t border-[#edf0f2] pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-[#9aa4b1]">Most requests are answered within 1 business day.</p>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex h-11 items-center justify-center gap-3 rounded-lg bg-[#f26757] px-5 text-sm font-semibold text-white shadow-[0_5px_12px_rgba(242,103,87,0.22)] transition hover:bg-[#df5a4b] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Submitting..." : "Submit ticket"}
              {!isSubmitting && <Icon name="arrow" />}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
