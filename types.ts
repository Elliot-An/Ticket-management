export type Priority = "Low" | "Medium" | "High" | "Urgent";

export type Ticket = {
  id: string;
  title: string;
  category: string;
  priority: Priority;
  time: string;
  status: "New" | "In Progress" | "Resolved";
};
