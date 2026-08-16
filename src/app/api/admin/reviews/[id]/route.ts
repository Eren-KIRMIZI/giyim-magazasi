import { NextResponse } from "next/server";
import { requireAdmin } from "@/modules/auth";
import { prisma } from "@/infrastructure/prisma";
import { logSecurity } from "@/lib/logger";
import { revalidateStorefront } from "@/lib/revalidate";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const existing = await prisma.review.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Yorum bulunamadı." }, { status: 404 });
  }

  await prisma.review.delete({ where: { id } });
  logSecurity("admin review delete", {
    id,
    productId: existing.productId,
    admin: admin.user.id,
  });
  revalidateStorefront();

  return NextResponse.json({ ok: true });
}
