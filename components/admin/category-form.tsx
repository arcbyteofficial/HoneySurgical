"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Category } from "@/lib/types/catalog";

export function CategoryForm({ categories }: { categories: Category[] }) {
  const [message, setMessage] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        parentId: formData.get("parentId") || null,
        description: formData.get("description"),
        imageUrl: formData.get("imageUrl"),
        sortOrder: formData.get("sortOrder")
      })
    });

    setMessage(response.ok ? "Category saved." : "Category could not be saved.");
  }

  return (
    <form onSubmit={submit} className="grid gap-4 rounded-lg border border-border bg-white p-5 shadow-sm">
      <div>
        <h2 className="text-xl font-semibold">Create Category</h2>
        <p className="mt-1 text-sm text-muted-foreground">Nested categories support the full product hierarchy.</p>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="parentId">Parent category</Label>
          <Select id="parentId" name="parentId">
            <option value="">Top level</option>
            {categories
              .filter((category) => !category.parentId)
              .map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
          </Select>
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" required />
      </div>
      <div className="grid gap-3 md:grid-cols-[1fr_160px]">
        <div className="grid gap-2">
          <Label htmlFor="imageUrl">Image URL</Label>
          <Input id="imageUrl" name="imageUrl" type="url" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="sortOrder">Sort order</Label>
          <Input id="sortOrder" name="sortOrder" type="number" defaultValue="1" min="0" />
        </div>
      </div>
      <Button type="submit">
        <Save aria-hidden="true" />
        Save Category
      </Button>
      {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
    </form>
  );
}
