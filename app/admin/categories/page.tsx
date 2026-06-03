import { AdminShell } from "@/components/admin/admin-shell";
import { CategoryForm } from "@/components/admin/category-form";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { requireAdmin } from "@/lib/auth/admin";
import { getAllCategories } from "@/lib/repositories/catalog-repository";

export default async function AdminCategoriesPage() {
  const [session, categories] = await Promise.all([requireAdmin(), getAllCategories()]);
  const byId = new Map(categories.map((category) => [category.id, category]));

  return (
    <AdminShell session={session}>
      <div className="grid gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-normal text-medical-deep">Category Management</h1>
          <p className="mt-2 text-muted-foreground">Create and manage nested categories for product discovery.</p>
        </div>
        <CategoryForm categories={categories} />
        <div className="rounded-lg border border-border bg-white p-5 shadow-sm">
          <h2 className="font-semibold">Categories</h2>
          <div className="mt-4 overflow-hidden rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Parent</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Sort</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">
                      {category.parentId ? "- " : ""}
                      {category.name}
                    </TableCell>
                    <TableCell>
                      {category.parentId ? byId.get(category.parentId)?.name : <Badge variant="beige">Top level</Badge>}
                    </TableCell>
                    <TableCell>{category.slug}</TableCell>
                    <TableCell>{category.sortOrder}</TableCell>
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
