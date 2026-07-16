import { AdminShell } from "@/components/admin/admin-shell";
import { ProductForm } from "@/components/admin/product-form";
import { AdminProductsList } from "@/components/admin/admin-products-list";
import { requireAdmin } from "@/lib/auth/admin";
import {
  getAllBrands,
  getAllCategories,
  searchProducts,
  getAllTemplates,
} from "@/lib/repositories/catalog-repository";

export default async function AdminProductsPage() {
  const [session, products, categories, brands, templates] = await Promise.all([
    requireAdmin(),
    searchProducts({ sort: "newest", status: "all" }),
    getAllCategories(),
    getAllBrands(),
    getAllTemplates(),
  ]);

  return (
    <AdminShell session={session}>
      <div className="grid gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-normal text-medical-deep">
            Product Management
          </h1>
          <p className="mt-2 text-muted-foreground">
            Create, edit, archive, and manage product image uploads.
          </p>
        </div>
        <ProductForm categories={categories} brands={brands} templates={templates} />
        <AdminProductsList products={products} />
      </div>
    </AdminShell>
  );
}
