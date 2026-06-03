import { AdminShell } from "@/components/admin/admin-shell";
import { InquiryStatusControl } from "@/components/admin/inquiry-status-control";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { requireAdmin } from "@/lib/auth/admin";
import { getRecentInquiries } from "@/lib/repositories/catalog-repository";

export default async function AdminInquiriesPage() {
  const [session, inquiries] = await Promise.all([requireAdmin(), getRecentInquiries()]);

  return (
    <AdminShell session={session}>
      <div className="grid gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-normal text-medical-deep">Inquiry Management</h1>
          <p className="mt-2 text-muted-foreground">Track quote requests from product pages and contact forms.</p>
        </div>
        <div className="rounded-lg border border-border bg-white p-5 shadow-sm">
          <div className="overflow-hidden rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inquiries.map((inquiry) => (
                  <TableRow key={inquiry.id}>
                    <TableCell className="font-medium">{inquiry.customerName}</TableCell>
                    <TableCell>
                      <a href={`mailto:${inquiry.email}`} className="block hover:text-primary">
                        {inquiry.email}
                      </a>
                      <a href={`tel:${inquiry.phone}`} className="block text-muted-foreground hover:text-primary">
                        {inquiry.phone}
                      </a>
                    </TableCell>
                    <TableCell>{inquiry.productName || <Badge variant="secondary">General</Badge>}</TableCell>
                    <TableCell className="max-w-xs truncate">{inquiry.message}</TableCell>
                    <TableCell>
                      <InquiryStatusControl inquiryId={inquiry.id} status={inquiry.status} />
                    </TableCell>
                    <TableCell>{new Date(inquiry.createdAt).toLocaleDateString("en-IN")}</TableCell>
                  </TableRow>
                ))}
                {!inquiries.length ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                      No inquiries yet.
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
