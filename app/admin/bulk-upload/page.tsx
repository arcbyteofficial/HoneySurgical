import { AdminShell } from "@/components/admin/admin-shell";
import { BulkUploadClient } from "@/components/admin/bulk-upload-client";
import { requireAdmin } from "@/lib/auth/admin";

export default async function AdminBulkUploadPage() {
  const session = await requireAdmin();

  return (
    <AdminShell session={session}>
      <BulkUploadClient />
    </AdminShell>
  );
}
