import { Boxes, FolderTree, Inbox, TrendingUp } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { DashboardCharts } from "@/components/admin/dashboard-charts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { requireAdmin } from "@/lib/auth/admin";
import { getDashboardMetrics } from "@/lib/repositories/catalog-repository";
import { formatCurrency } from "@/lib/utils";
import { SeedButton } from "@/components/admin/seed-button";

const widgetIcons = [Boxes, FolderTree, Inbox, TrendingUp];

export default async function AdminDashboardPage() {
  const [session, metrics] = await Promise.all([requireAdmin(), getDashboardMetrics()]);
  const widgets = [
    { label: "Total Products", value: metrics.totalProducts },
    { label: "Total Categories", value: metrics.totalCategories },
    { label: "Total Inquiries", value: metrics.totalInquiries },
    { label: "Most Viewed", value: metrics.mostViewedProducts[0]?.viewCount || 0 }
  ];

  return (
    <AdminShell session={session}>
      <div className="grid gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-normal text-medical-deep">Dashboard</h1>
            <p className="mt-2 text-muted-foreground">Operational overview for catalog, inquiry, and product analytics.</p>
          </div>
          <SeedButton />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {widgets.map((widget, index) => {
            const Icon = widgetIcons[index];
            return (
              <div key={widget.label} className="rounded-lg border border-border bg-white p-5 shadow-sm">
                <Icon className="size-5 text-primary" aria-hidden="true" />
                <p className="mt-4 text-sm text-muted-foreground">{widget.label}</p>
                <p className="mt-1 text-3xl font-bold text-medical-deep">{widget.value}</p>
              </div>
            );
          })}
        </div>

        <DashboardCharts metrics={metrics} />

        <div className="rounded-lg border border-border bg-white p-5 shadow-sm">
          <h2 className="font-semibold">Most Viewed Products</h2>
          <div className="mt-4 overflow-hidden rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Views</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {metrics.mostViewedProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.sku}</TableCell>
                    <TableCell>{product.category.name}</TableCell>
                    <TableCell>{formatCurrency(product.price)}</TableCell>
                    <TableCell>{product.viewCount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
