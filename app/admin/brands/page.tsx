import { AdminShell } from "@/components/admin/admin-shell";
import { BrandForm } from "@/components/admin/brand-form";
import { requireAdmin } from "@/lib/auth/admin";
import { getAllBrands } from "@/lib/repositories/catalog-repository";

export default async function AdminBrandsPage() {
  const [session, brands] = await Promise.all([requireAdmin(), getAllBrands()]);

  return (
    <AdminShell session={session}>
      <div className="grid gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-normal text-medical-deep">Brand Management</h1>
          <p className="mt-2 text-muted-foreground">Create and manage brands for product discovery.</p>
        </div>
        <BrandForm brands={brands} />
      </div>
    </AdminShell>
  );
}
