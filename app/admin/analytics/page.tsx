import { AdminShell } from "@/components/admin/admin-shell";
import { DashboardCharts } from "@/components/admin/dashboard-charts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { requireAdmin } from "@/lib/auth/admin";
import { getDashboardMetrics } from "@/lib/repositories/catalog-repository";

export default async function AdminAnalyticsPage() {
  const [session, metrics] = await Promise.all([requireAdmin(), getDashboardMetrics()]);

  return (
    <AdminShell session={session}>
      <div className="grid gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-normal text-medical-deep">Analytics Dashboard</h1>
          <p className="mt-2 text-muted-foreground">Track product views, search trends, inquiries, and popular categories.</p>
        </div>
        <DashboardCharts metrics={metrics} />
        <div className="rounded-lg border border-border bg-white p-5 shadow-sm">
          <h2 className="font-semibold">Search Trends</h2>
          <div className="mt-4 overflow-hidden rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Query</TableHead>
                  <TableHead>Count</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {metrics.searchTrends.map((trend) => (
                  <TableRow key={trend.query}>
                    <TableCell className="font-medium">{trend.query}</TableCell>
                    <TableCell>{trend.count}</TableCell>
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
