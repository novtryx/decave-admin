import { Transaction, EventTransactionSummary } from "@/types/transactionsType";
import { Event, TotalTicketStats } from "@/types/eventsType";

//calculate totaltickets
//geteventStatus
//format date

export const calculateTotalTickets = (
  tickets: Event['tickets']
): TotalTicketStats => {
  let totalInitialTickets = 0;
  let totalSoldTickets = 0;

  for (const ticket of tickets) {
    totalInitialTickets += ticket.initialQuantity;
    totalSoldTickets += ticket.initialQuantity - ticket.availableQuantity;
  }

  return {
    totalInitialTickets,
    totalSoldTickets
  };
};

type EventStatus = "draft" | "live" | "past" | "upcoming";

export const getEventStatus = (event: Event): EventStatus => {
  const now = new Date();
  const eventStartDate = new Date(event.eventDetails.startDate);
  const eventEndDate = new Date(event.eventDetails.endDate);

  // Check if event is in draft mode
  if (!event.published) {
    return "draft";
  }

  // Event is published and complete (stage 5)
  // Check if event has ended
  if (eventEndDate < now) {
    return "past";
  }

  // Check if event hasn't started yet
  if (eventStartDate > now) {
    return "upcoming";
  }

  // Event is currently happening
  return "live";
};

export const formatDate = (date: Date | string): string => {
  const dateObj = new Date(date);
  
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  
  const month = months[dateObj.getMonth()];
  const day = dateObj.getDate();
  const year = dateObj.getFullYear();
  
  return `${month} ${day}, ${year}`;
};

/**
 * Search events by title, venue, or event type
 */
export function searchEvents(events: Event[], searchQuery: string): Event[] {
  if (!searchQuery.trim()) {
    return events;
  }

  const query = searchQuery.toLowerCase().trim();

  return events.filter((event) => {
    const { eventTitle, venue, eventType } = event.eventDetails;
    return (
      eventTitle.toLowerCase().includes(query) ||
      venue.toLowerCase().includes(query) ||
      eventType.toLowerCase().includes(query)
    );
  });
}

/**
 * Sort events by their start date
 */
export function sortEventsByDate(
  events: Event[],
  sortOrder: "all" | "new" | "old"
): Event[] {
  if (sortOrder === "all") {
    return events;
  }

  const sorted = [...events].sort((a, b) => {
    const dateA = new Date(a.eventDetails.startDate).getTime();
    const dateB = new Date(b.eventDetails.startDate).getTime();
    return sortOrder === "new" ? dateB - dateA : dateA - dateB;
  });

  return sorted;
}

/**
 * Converts an ISO date string (or null/undefined) to the
 * "YYYY-MM-DD" format expected by <input type="date" />.
 */
export const toDateInputValue = (iso?: string | null): string => {
  if (!iso) return "";
  return new Date(iso).toISOString().slice(0, 10);
};
export function searchEventSummaries(
  events: EventTransactionSummary[],
  searchQuery: string
): EventTransactionSummary[] {
  if (!searchQuery.trim()) {
    return events;
  }

  const query = searchQuery.toLowerCase().trim();

  return events.filter(
    (event) =>
      event.eventTitle.toLowerCase().includes(query) ||
      event.venue.toLowerCase().includes(query)
  );
}

/**
 * Search transactions WITHIN a single event by transaction ID, buyer
 * email, or ticket type. (Event title/venue no longer apply here —
 * the table is already scoped to one event.)
 */
export function searchTransactions(
  transactions: Transaction[],
  searchQuery: string
): Transaction[] {
  if (!searchQuery.trim()) {
    return transactions;
  }

  const query = searchQuery.toLowerCase().trim();

  return transactions.filter((transaction) => {
    const matchesTxnId = transaction.txnId.toLowerCase().includes(query);
    const matchesBuyer = transaction.buyerEmail.toLowerCase().includes(query);
    const matchesTicketType = transaction.ticket.ticketName
      .toLowerCase()
      .includes(query);

    return matchesTxnId || matchesBuyer || matchesTicketType;
  });
}

/**
 * Filter transactions by status
 */
export function filterTransactionsByStatus(
  transactions: Transaction[],
  status: string
): Transaction[] {
  if (status === "all") {
    return transactions;
  }

  return transactions.filter(
    (transaction) => transaction.status.toLowerCase() === status.toLowerCase()
  );
}

/**
 * Sort transactions by date
 */
export function sortTransactionsByDate(
  transactions: Transaction[],
  sortOrder: "new" | "old" | "all"
): Transaction[] {
  if (sortOrder === "all") {
    return transactions;
  }

  const sorted = [...transactions].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();

    return sortOrder === "new" ? dateB - dateA : dateA - dateB;
  });

  return sorted;
}

/**
 * Filter transactions by period (this month, last month, etc.)
 */
export function filterTransactionsByPeriod(
  transactions: Transaction[],
  period: "all" | "this-month" | "last-month"
): Transaction[] {
  if (period === "all") {
    return transactions;
  }

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  return transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.createdAt);
    const transactionMonth = transactionDate.getMonth();
    const transactionYear = transactionDate.getFullYear();

    if (period === "this-month") {
      return (
        transactionMonth === currentMonth && transactionYear === currentYear
      );
    }

    if (period === "last-month") {
      const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      return transactionMonth === lastMonth && transactionYear === lastMonthYear;
    }

    return true;
  });
}

/**
 * Format date for export
 */
function formatDateForExport(dateString: string): string {
  return new Date(dateString).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Convert transactions (scoped to a single event) to CSV format
 */
export function transactionsToCSV(transactions: Transaction[]): string {
  const headers = [
    "Transaction ID",
    "Ticket Type",
    "Price",
    "Currency",
    "Quantity",
    "Amount",
    "Buyer Email",
    "Checked In",
    "Status",
    "Payment ID",
    "Date",
  ];

  const rows = transactions.map((transaction) => [
    transaction.txnId,
    transaction.ticket.ticketName,
    transaction.ticket.price,
    transaction.ticket.currency,
    transaction.quantity,
    transaction.revenue,
    transaction.buyerEmail,
    `${transaction.checkedInCount}/${transaction.quantity}`,
    transaction.status,
    transaction.paystackId,
    formatDateForExport(transaction.createdAt),
  ]);

  const escapeCSVValue = (value: string | number | null | undefined): string => {
    if (value === null || value === undefined) return "";
    const stringValue = String(value);
    if (
      stringValue.includes(",") ||
      stringValue.includes('"') ||
      stringValue.includes("\n")
    ) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
  };

  const csvContent = [
    headers.map(escapeCSVValue).join(","),
    ...rows.map((row) => row.map(escapeCSVValue).join(",")),
  ].join("\n");

  return csvContent;
}

/**
 * Download data as CSV file
 */
export function downloadCSV(
  transactions: Transaction[],
  filename: string = "transactions"
): void {
  const csv = transactionsToCSV(transactions);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");

  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `${filename}_${new Date().toISOString().split("T")[0]}.csv`
  );
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

/**
 * Convert transactions (scoped to a single event) to Excel-compatible
 * TSV format
 */
export function transactionsToTSV(transactions: Transaction[]): string {
  const headers = [
    "Transaction ID",
    "Ticket Type",
    "Price",
    "Currency",
    "Quantity",
    "Amount",
    "Buyer Email",
    "Checked In",
    "Status",
    "Payment ID",
    "Date",
  ];

  const rows = transactions.map((transaction) => [
    transaction.txnId,
    transaction.ticket.ticketName,
    transaction.ticket.price,
    transaction.ticket.currency,
    transaction.quantity,
    transaction.revenue,
    transaction.buyerEmail,
    `${transaction.checkedInCount}/${transaction.quantity}`,
    transaction.status.toUpperCase(),
    transaction.paystackId,
    formatDateForExport(transaction.createdAt),
  ]);

  const tsvContent = [
    headers.join("\t"),
    ...rows.map((row) => row.map((value) => String(value ?? "")).join("\t")),
  ].join("\n");

  return tsvContent;
}

/**
 * Download data as Excel file (TSV format)
 */
export function downloadExcel(
  transactions: Transaction[],
  filename: string = "transactions"
): void {
  const tsv = transactionsToTSV(transactions);
  const blob = new Blob([tsv], {
    type: "application/vnd.ms-excel;charset=utf-8;",
  });
  const link = document.createElement("a");

  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `${filename}_${new Date().toISOString().split("T")[0]}.xls`
  );
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

/**
 * Download data as JSON file
 */
export function downloadJSON(
  transactions: Transaction[],
  filename: string = "transactions"
): void {
  const json = JSON.stringify(transactions, null, 2);
  const blob = new Blob([json], { type: "application/json;charset=utf-8;" });
  const link = document.createElement("a");

  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `${filename}_${new Date().toISOString().split("T")[0]}.json`
  );
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

/**
 * Export transactions with format selection
 */
export function exportTransactions(
  transactions: Transaction[],
  format: "csv" | "excel" | "json" = "csv",
  filename: string = "transactions"
): void {
  if (transactions.length === 0) {
    alert("No transactions to export");
    return;
  }

  switch (format) {
    case "csv":
      downloadCSV(transactions, filename);
      break;
    case "excel":
      downloadExcel(transactions, filename);
      break;
    case "json":
      downloadJSON(transactions, filename);
      break;
    default:
      downloadCSV(transactions, filename);
  }
}