"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Brand } from "@/lib/types/catalog";

export function BrandForm({ brands }: { brands: Brand[] }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBrands = brands.filter((brand) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return brand.name.toLowerCase().includes(q) || brand.slug.toLowerCase().includes(q);
  });

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
    <div className="grid gap-6">
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

      <div className="rounded-lg border border-border bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-lg text-medical-deep">Brands</h2>
            <Badge variant="secondary" className="text-xs">
              {filteredBrands.length} {filteredBrands.length === 1 ? "brand" : "brands"}
            </Badge>
          </div>
          <div className="w-full sm:w-64">
            <Input
              type="search"
              placeholder="Search brands..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 text-xs"
            />
          </div>
        </div>

        {/* Mobile Card List View */}
        <div className="grid gap-4 md:hidden">
          {filteredBrands.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground border border-dashed rounded-xl bg-white text-sm">
              {searchQuery ? `No brands matching "${searchQuery}".` : "No brands found. Create one above."}
            </div>
          ) : (
            filteredBrands.map((brand) => (
              <div 
                key={brand.id} 
                className="flex items-center justify-between gap-3 rounded-xl border border-border/80 bg-medical-bluePale/5 p-4 shadow-sm"
              >
                <span className="font-bold text-sm text-medical-deep">
                  {brand.name}
                </span>
                <span className="font-mono text-xs text-muted-foreground select-all bg-white border px-2 py-0.5 rounded">
                  {brand.slug}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-hidden rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBrands.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-center text-muted-foreground py-8">
                    {searchQuery ? `No brands matching "${searchQuery}".` : "No brands found. Create one above."}
                  </TableCell>
                </TableRow>
              ) : (
                filteredBrands.map((brand) => (
                  <TableRow key={brand.id}>
                    <TableCell className="font-medium text-medical-deep font-semibold">
                      {brand.name}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{brand.slug}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
