"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type FormState = "idle" | "submitting" | "success" | "error";

export function InquiryForm({
  productId,
  productName
}: {
  productId?: string | null;
  productName?: string | null;
}) {
  const [state, setState] = useState<FormState>("idle");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const response = await fetch("/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName: formData.get("customerName"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        message: formData.get("message"),
        productId,
        productName
      })
    });

    if (response.ok) {
      setState("success");
      form.reset();
    } else {
      setState("error");
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-4 rounded-lg border border-border bg-white p-5 shadow-sm">
      <div>
        <h2 className="text-xl font-semibold">{productName ? "Request Quote" : "Contact Sales"}</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {productName ? `Share your requirement for ${productName}.` : "Send your requirement to the sales team."}
        </p>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="customerName">Customer name</Label>
        <Input id="customerName" name="customerName" required autoComplete="name" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required autoComplete="email" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" required autoComplete="tel" />
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          name="message"
          required
          defaultValue={
            productName ? `Hello HONEY SURGICALS, I would like information regarding ${productName}` : ""
          }
        />
      </div>
      <Button type="submit" disabled={state === "submitting"}>
        <Send aria-hidden="true" />
        {state === "submitting" ? "Sending..." : "Send Inquiry"}
      </Button>
      {state === "success" ? (
        <p className="text-sm font-medium text-primary" role="status">
          Inquiry submitted. The sales team can follow up from the admin panel.
        </p>
      ) : null}
      {state === "error" ? (
        <p className="text-sm font-medium text-destructive" role="alert">
          Could not submit inquiry. Please try again or contact sales directly.
        </p>
      ) : null}
    </form>
  );
}
