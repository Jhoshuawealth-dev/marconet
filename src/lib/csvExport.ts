// Simple CSV export helper. Accepts an array of row objects and downloads as file.
export function exportCSV(filename: string, rows: Record<string, string | number>[]) {
  if (!rows || rows.length === 0) {
    const blob = new Blob(["(no data)"], { type: "text/csv;charset=utf-8;" });
    triggerDownload(blob, filename);
    return;
  }
  const headers = Object.keys(rows[0]);
  const escape = (v: unknown) => {
    const s = v == null ? "" : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = [
    headers.join(","),
    ...rows.map(r => headers.map(h => escape(r[h])).join(",")),
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  triggerDownload(blob, filename);
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
