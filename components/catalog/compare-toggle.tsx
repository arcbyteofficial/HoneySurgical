"use client";

import { ReactNode, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const key = "honey-surgicals-compare";

function getStoredItems() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    return JSON.parse(window.localStorage.getItem(key) || "[]") as string[];
  } catch {
    return [];
  }
}

export function CompareToggle({
  productSlug,
  productName,
  children
}: {
  productSlug: string;
  productName: string;
  children: ReactNode;
}) {
  const [selected, setSelected] = useState(false);

  useEffect(() => {
    setSelected(getStoredItems().includes(productSlug));
  }, [productSlug]);

  function toggle() {
    const current = getStoredItems();
    const next = current.includes(productSlug)
      ? current.filter((item) => item !== productSlug)
      : [...current, productSlug].slice(-4);

    window.localStorage.setItem(key, JSON.stringify(next));
    setSelected(next.includes(productSlug));
    window.dispatchEvent(new CustomEvent("compare-updated", { detail: next }));
  }

  return (
    <Button
      type="button"
      variant={selected ? "default" : "outline"}
      size="icon"
      onClick={toggle}
      aria-label={`${selected ? "Remove" : "Add"} ${productName} ${selected ? "from" : "to"} comparison`}
      title={selected ? "Remove from compare" : "Compare product"}
    >
      {children}
    </Button>
  );
}
