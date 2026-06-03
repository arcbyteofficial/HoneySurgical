"use client";

import { useState } from "react";
import { FileSpreadsheet, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type Row = Record<string, string | number | boolean | null>;

export function BulkUploadClient() {
  const [rows, setRows] = useState<Row[]>([]);
  const [message, setMessage] = useState("");

  async function parseFile(file: File) {
    let parsed: Row[] = [];

    if (file.name.toLowerCase().endsWith(".csv")) {
      const text = await file.text();
      const [headerLine = "", ...lines] = text.split(/\r?\n/).filter(Boolean);
      const headers = headerLine.split(",").map((item) => item.trim());
      parsed = lines.map((line) => {
        const values = line.split(",").map((item) => item.trim());
        return headers.reduce<Row>((row, header, index) => {
          row[header] = values[index] || "";
          return row;
        }, {});
      });
    } else {
      const { readSheet } = await import("read-excel-file/browser");
      const sheetRows = await readSheet(file);
      const headers = (sheetRows[0] || []).map((item: unknown) => String(item || "").trim());
      parsed = sheetRows.slice(1).map((line: unknown[]) =>
        headers.reduce<Row>((row, header, index) => {
          row[header] = (line[index] as string | number | boolean | null) || "";
          return row;
        }, {})
      );
    }

    setRows(parsed);
    setMessage(`${parsed.length} rows loaded for review.`);
  }

  async function upload() {
    const response = await fetch("/api/admin/products/bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rows })
    });

    setMessage(response.ok ? "Bulk upload processed." : "Bulk upload failed.");
  }

  const columns = rows.length ? Object.keys(rows[0]).slice(0, 8) : [];

  return (
    <div className="grid gap-5 rounded-lg border border-border bg-white p-5 shadow-sm">
      <div>
        <h1 className="text-2xl font-bold text-medical-deep">Bulk Product Upload</h1>
        <p className="mt-2 text-sm text-muted-foreground">Upload CSV or Excel files, review rows, then send them to Supabase.</p>
      </div>
      <label className="grid cursor-pointer place-items-center rounded-lg border border-dashed border-border bg-secondary p-8 text-center hover:bg-medical-pale">
        <FileSpreadsheet className="size-9 text-primary" aria-hidden="true" />
        <span className="mt-2 font-medium">Choose CSV or Excel file</span>
        <Input
          type="file"
          accept=".csv,.xlsx,.xls"
          className="sr-only"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) {
              parseFile(file);
            }
          }}
        />
      </label>

      {rows.length ? (
        <>
          <div className="overflow-hidden rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map((column) => (
                    <TableHead key={column}>{column}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.slice(0, 20).map((row, index) => (
                  <TableRow key={index}>
                    {columns.map((column) => (
                      <TableCell key={column}>{String(row[column] ?? "")}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <Button onClick={upload} className="w-fit">
            <Upload aria-hidden="true" />
            Import Rows
          </Button>
        </>
      ) : null}

      {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
    </div>
  );
}
