export const statusObject: { [key: string]: string } = {
  pending: "Pending",
  "in-progress": "In Progress",
  completed: "Completed",
};

export type JsonFromExcelType = {
  Title: string;
  Description: string;
  Status: "pending" | "in-progress" | "completed";
};
