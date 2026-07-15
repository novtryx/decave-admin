// Generic, reusable CSV/Excel export — takes plain headers + rows so
// it works for any table (customers, finance entries, analytics,
// sponsors) without needing a type-specific export function like the
// existing transactionsToCSV/downloadCSV pair in functions.ts.

export type ExportCell = string | number | boolean | null | undefined;

function escapeCell(value: ExportCell): string {
  const stringValue = value === null || value === undefined ? "" : String(value);
  if (stringValue.includes(",") || stringValue.includes('"') || stringValue.includes("\n")) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}

export function rowsToCSV(headers: string[], rows: ExportCell[][]): string {
  return [headers.map(escapeCell).join(","), ...rows.map((row) => row.map(escapeCell).join(","))].join(
    "\n"
  );
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function downloadCSVGeneric(headers: string[], rows: ExportCell[][], filename: string) {
  const csv = rowsToCSV(headers, rows);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  triggerDownload(blob, `${filename}_${new Date().toISOString().split("T")[0]}.csv`);
}

// Excel opens tab-separated .xls files just fine, same trick already
// used for transactionsToTSV/downloadExcel elsewhere in the codebase.
export function downloadExcelGeneric(headers: string[], rows: ExportCell[][], filename: string) {
  const tsv = [headers.join("\t"), ...rows.map((row) => row.join("\t"))].join("\n");
  const blob = new Blob([tsv], { type: "application/vnd.ms-excel;charset=utf-8;" });
  triggerDownload(blob, `${filename}_${new Date().toISOString().split("T")[0]}.xls`);
}