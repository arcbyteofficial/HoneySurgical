import type { Metadata } from "next";
import { AdminLoginForm } from "@/components/admin/admin-login-form";

export const metadata: Metadata = {
  title: "Admin Login"
};

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-medical-grey">
      <AdminLoginForm />
    </div>
  );
}

