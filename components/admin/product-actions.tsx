"use client";

import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function ProductActions({
  productId,
  productSlug,
  productName
}: {
  productId: string;
  productSlug: string;
  productName: string;
}) {
  const router = useRouter();

  async function remove() {
    const ok = window.confirm(`Delete ${productName}?`);
    if (!ok) {
      return;
    }

    await fetch(`/api/admin/products/${productId}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="flex justify-end gap-2">
      <Button asChild variant="outline" size="icon">
        <Link href={`/admin/products/${productSlug}`} aria-label={`Edit ${productName}`}>
          <Pencil aria-hidden="true" />
        </Link>
      </Button>
      <Button variant="outline" size="icon" aria-label={`Delete ${productName}`} onClick={remove}>
        <Trash2 aria-hidden="true" />
      </Button>
    </div>
  );
}
