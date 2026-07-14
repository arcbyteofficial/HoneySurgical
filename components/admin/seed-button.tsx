"use client";

import { useState } from "react";
import { Database } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SeedButton() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSeed() {
    const confirmed = confirm(
      "Are you sure you want to seed the database? This will CLEAR all existing products, categories, and brands, and replace them with the standard live catalog!"
    );
    if (!confirmed) {
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/admin/seed", { method: "POST" });
      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        setMessage(data.message || "Database seeded successfully!");
        window.location.reload();
      } else {
        setMessage(data.error || "Seeding failed.");
      }
    } catch (err) {
      setMessage("An error occurred during database seeding.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-1 items-start sm:items-end">
      <Button onClick={handleSeed} disabled={loading} variant="outline" size="sm" className="gap-2">
        <Database className="h-4 w-4" />
        {loading ? "Seeding Database..." : "Seed Database"}
      </Button>
      {message ? <p className="text-xs font-medium text-primary mt-1">{message}</p> : null}
    </div>
  );
}
