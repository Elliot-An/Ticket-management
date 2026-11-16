import type { Priority, Ticket } from "../types";

export const PRIORITIES: Priority[] = ["Low", "Medium", "High", "Urgent"];

export const TICKET_STATUSES = ["New", "In Progress", "Resolved"] as const;

export const PRIORITY_STYLES: Record<Priority, string> = {
  Urgent: "bg-[#ffe9e8] text-[#c84b4b]",
  High: "bg-[#fff0df] text-[#c87922]",
  Medium: "bg-[#fff7d9] text-[#b58b16]",
  Low: "bg-[#e2f5ee] text-[#21815b]",
};

export const INITIAL_TICKETS: Ticket[] = [
  { id: "INC-1048", title: "Unable to access shared drive", category: "Access", priority: "High", time: "12 min ago", status: "New" },
  { id: "INC-1047", title: "Laptop keeps restarting", category: "Hardware", priority: "Urgent", time: "34 min ago", status: "New" },
  { id: "INC-1046", title: "Set up new email signature", category: "Email", priority: "Low", time: "1 hr ago", status: "New" },
  { id: "INC-1045", title: "VPN connection drops frequently", category: "Network", priority: "High", time: "2 hrs ago", status: "In Progress" },
  { id: "INC-1044", title: "Install design software", category: "Software", priority: "Medium", time: "3 hrs ago", status: "In Progress" },
  { id: "INC-1041", title: "Request for second monitor", category: "Hardware", priority: "Low", time: "Yesterday", status: "Resolved" },
  { id: "INC-1040", title: "Password reset request", category: "Access", priority: "Medium", time: "Yesterday", status: "Resolved" },
];
