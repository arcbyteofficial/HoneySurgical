"use client";

import { useState } from "react";
import { Select } from "@/components/ui/select";
import type { InquiryStatus } from "@/lib/types/catalog";

export function InquiryStatusControl({ inquiryId, status }: { inquiryId: string; status: InquiryStatus }) {
  const [current, setCurrent] = useState(status);

  async function update(next: InquiryStatus) {
    setCurrent(next);
    await fetch(`/api/admin/inquiries/${inquiryId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next })
    });
  }

  return (
    <Select value={current} onChange={(event) => update(event.target.value as InquiryStatus)} aria-label="Inquiry status">
      <option value="new">New</option>
      <option value="contacted">Contacted</option>
      <option value="closed">Closed</option>
    </Select>
  );
}
