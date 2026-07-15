"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Boxes, FolderTree, Inbox, LayoutDashboard, Tag, Upload } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { AdminSession } from "@/lib/auth/admin";
import { cn } from "@/lib/utils";

const adminNav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Boxes },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/brands", label: "Brands", icon: Tag },
  { href: "/admin/inquiries", label: "Inquiries", icon: Inbox },
  { href: "/admin/bulk-upload", label: "Bulk Upload", icon: Upload },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 }
];

export function AdminShell({ session, children }: { session: AdminSession; children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <section className="bg-background min-h-[calc(100vh-8rem)]">
      <div className="container py-8 space-y-6">
        {/* Premium Admin Header */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/60 pb-5">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-medical-deep">
              Admin Panel
            </h1>
            <p className="text-xs text-muted-foreground">
              Manage product listings, taxonomy categories, bulk operations, and customer inquiries.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="beige" className="bg-medical-bluePale/30 text-medical-deep border border-medical-blue/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
              {session.role.replace("_", " ")}
            </Badge>
            {session.demo ? (
              <Badge variant="secondary" className="px-3 py-1 text-xs font-semibold">
                Demo Mode
              </Badge>
            ) : null}
          </div>
        </header>

        {/* Horizontal Navigation Menu - Scrollable on mobile, high contrast active indicators */}
        <nav aria-label="Admin navigation" className="w-full border-b border-border/40 pb-2">
          <div className="flex overflow-x-auto pb-2 -mx-4 px-4 scrollbar-none sm:mx-0 sm:px-0 gap-1.5 sm:gap-2">
            {adminNav.map((item) => {
              const Icon = item.icon;
              // Highlight active tabs, including subpaths like "/admin/products/new"
              const isActive = pathname === item.href || (item.href !== "/admin" && pathname?.startsWith(item.href));
              
              return (
                <Link
                  key={item.href}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  href={item.href as any}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs sm:text-sm font-medium transition-all focus-ring border whitespace-nowrap",
                    isActive
                      ? "bg-medical-deep text-white border-medical-deep shadow-sm font-semibold"
                      : "bg-white text-muted-foreground border-border/80 hover:bg-medical-bluePale/30 hover:text-medical-deep hover:border-medical-blue/30"
                  )}
                >
                  <Icon className="size-4" aria-hidden="true" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Main Content Area */}
        <div className="min-w-0 bg-white border border-border/60 rounded-2xl p-4 sm:p-6 shadow-sm">
          {children}
        </div>
      </div>
    </section>
  );
}
