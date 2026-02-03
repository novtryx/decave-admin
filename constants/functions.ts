import { Transaction } from "@/types/transactionsType";
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
 * Search transactions by event title, transaction ID, buyer email, or ticket type
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
    // Search in transaction ID
    const matchesTxnId = transaction.txnId.toLowerCase().includes(query);

    // Search in event title
    const matchesEventTitle = transaction.event.eventTitle
      .toLowerCase()
      .includes(query);

    // Search in buyer email
    // const matchesBuyer = transaction.buyers.toLowerCase().includes(query);
    const matchesBuyer = transaction.buyerEmail.toLowerCase().includes(query.toLowerCase());

    // Search in ticket type
    const matchesTicketType = transaction.ticket.ticketName
      .toLowerCase()
      .includes(query);

    // Search in venue
    const matchesVenue = transaction.event.venue.toLowerCase().includes(query);

    return (
      matchesTxnId ||
      matchesEventTitle ||
      matchesBuyer ||
      matchesTicketType ||
      matchesVenue
    );
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
 * Convert transactions to CSV format
 */
export function transactionsToCSV(transactions: Transaction[]): string {
  // Define CSV headers
  const headers = [
    "Transaction ID",
    "Event Title",
    "Event Type",
    "Venue",
    "Ticket Type",
    "Price",
    "Currency",
    "Quantity Sold",
    "Available",
    "Buyer Email",
    "Status",
    "Payment ID",
    "Date",
  ];

  // Convert transactions to CSV rows
  const rows = transactions.map((transaction) => {
    const quantitySold =
      transaction.ticket.initialQuantity - transaction.ticket.availableQuantity;

    return [
      transaction.txnId,
      transaction.event.eventTitle,
      transaction.event.eventType,
      transaction.event.venue,
      transaction.ticket.ticketName,
      transaction.ticket.price,
      transaction.ticket.currency,
      quantitySold,
      transaction.ticket.availableQuantity,
      transaction.buyerEmail,
      transaction.status,
      transaction.paystackId,
      formatDateForExport(transaction.createdAt),
    ];
  });

  // Escape CSV values (handle commas, quotes, newlines)
  const escapeCSVValue = (value: any): string => {
    if (value === null || value === undefined) return "";
    const stringValue = String(value);
    // If value contains comma, quote, or newline, wrap in quotes and escape quotes
    if (
      stringValue.includes(",") ||
      stringValue.includes('"') ||
      stringValue.includes("\n")
    ) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
  };

  // Combine headers and rows
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

  // Clean up the URL object
  URL.revokeObjectURL(url);
}

/**
 * Convert transactions to Excel-compatible format (TSV - Tab Separated Values)
 * TSV is better for Excel as it handles commas in data better
 */
export function transactionsToTSV(transactions: Transaction[]): string {
  // Define TSV headers
  const headers = [
    "Transaction ID",
    "Event Title",
    "Event Type",
    "Venue",
    "Address",
    "Ticket Type",
    "Price",
    "Currency",
    "Quantity Sold",
    "Available Quantity",
    "Total Quantity",
    "Buyer Email",
    "Status",
    "Payment ID",
    "Date",
    "Event Start Date",
    "Event End Date",
  ];

  // Convert transactions to TSV rows
  const rows = transactions.map((transaction) => {
    const quantitySold =
      transaction.ticket.initialQuantity - transaction.ticket.availableQuantity;

    return [
      transaction.txnId,
      transaction.event.eventTitle,
      transaction.event.eventType,
      transaction.event.venue,
      transaction.event.address,
      transaction.ticket.ticketName,
      transaction.ticket.price,
      transaction.ticket.currency,
      quantitySold,
      transaction.ticket.availableQuantity,
      transaction.ticket.initialQuantity,
      transaction.buyerEmail,
      transaction.status.toUpperCase(),
      transaction.paystackId,
      formatDateForExport(transaction.createdAt),
      formatDateForExport(transaction.event.startDate),
      formatDateForExport(transaction.event.endDate),
    ];
  });

  // Combine headers and rows with tabs
  const tsvContent = [
    headers.join("\t"),
    ...rows.map((row) =>
      row.map((value) => String(value ?? "")).join("\t")
    ),
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

  // Clean up the URL object
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

  // Clean up the URL object
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