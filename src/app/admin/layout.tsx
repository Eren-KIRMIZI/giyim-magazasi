import { redirect } from "next/navigation";
import { auth } from "@/modules/auth";
import AdminNav from "@/components/admin/AdminNav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/giris");
  }
  if (session.user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg">
      <div className="flex flex-col md:flex-row gap-gutter">
        <AdminNav />
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
}
