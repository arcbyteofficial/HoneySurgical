"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Brand } from "@/lib/types/catalog";

export function BrandForm({ brands }: { brands: Brand[] }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = formData.get("name")?.toString().trim();

    if (!name) {
      setMessage("Brand name is required.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/admin/brands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (response.ok) {
        setMessage("Brand saved successfully.");
        form.reset();
        router.refresh();
      } else {
        const data = await response.json().catch(() => ({}));
        setMessage(data.error || "Brand could not be saved.");
      }
    } catch (err) {
      setMessage("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-4 rounded-lg border border-border bg-white p-5 shadow-sm">
      <div>
        <h2 className="text-xl font-semibold">Create Brand</h2>
        <p className="mt-1 text-sm text-muted-foreground">Add a new brand to associate with catalog products.</p>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="name">Brand Name</Label>
        <Input id="name" name="name" required placeholder="e.g. Philips, GE Healthcare" className="focus-ring" />
      </div>
      <Button type="submit" disabled={loading} className="w-full sm:w-auto">
        <Save aria-hidden="true" className="mr-2 h-4 w-4" />
        {loading ? "Saving Brand..." : "Save Brand"}
      </Button>
      {message ? <p className="text-sm text-muted-foreground mt-2">{message}</p> : null}
    </form>
  );
}
