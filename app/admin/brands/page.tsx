import { AdminShell } from "@/components/admin/admin-shell";
import { BrandForm } from "@/components/admin/brand-form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
        <div className="rounded-lg border border-border bg-white p-5 shadow-sm">
          <h2 className="font-semibold">Brands</h2>
          <div className="mt-4 overflow-hidden rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {brands.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center text-muted-foreground py-8">
                      No brands found. Create one above.
                    </TableCell>
                  </TableRow>
                ) : (
                  brands.map((brand) => (
                    <TableRow key={brand.id}>
                      <TableCell className="font-medium">
                        {brand.name}
                      </TableCell>
                      <TableCell>{brand.slug}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
