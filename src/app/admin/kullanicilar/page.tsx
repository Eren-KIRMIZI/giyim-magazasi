import type { Metadata } from "next";
import { auth } from "@/modules/auth";
import { getAdminUsers } from "@/modules/admin";
import UserManager from "./UserManager";

export const metadata: Metadata = {
  title: "Kullanıcılar",
  description: "Kullanıcı yönetimi.",
};

export default async function AdminUsersPage() {
  const session = await auth();

  const users = await getAdminUsers();

  return (
    <div className="flex flex-col gap-stack-lg">
      <div className="flex justify-between items-end border-b border-on-surface pb-stack-sm">
        <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg uppercase text-on-surface">
          Kullanıcılar
        </h1>
      </div>

      <UserManager currentUserId={session?.user?.id ?? ""} initialUsers={users} />
    </div>
  );
}
