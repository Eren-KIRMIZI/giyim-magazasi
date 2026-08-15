import { NextResponse } from "next/server";
import { requireAdmin } from "@/modules/auth";
import {
  updateProduct,
  deleteProduct,
  AdminProductValidationError,
  AdminProductSlugConflictError,
  AdminProductCategoryError,
  AdminProductNotFoundError,
  AdminProductInUseError,
} from "@/modules/admin";
import { logSecurity } from "@/lib/logger";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  try {
    const product = await updateProduct(id, body);
    return NextResponse.json({ product });
  } catch (err) {
    if (err instanceof AdminProductNotFoundError) {
      return NextResponse.json({ error: err.message }, { status: 404 });
    }
    if (err instanceof AdminProductSlugConflictError) {
      return NextResponse.json({ error: err.message }, { status: 409 });
    }
    if (
      err instanceof AdminProductValidationError ||
      err instanceof AdminProductCategoryError
    ) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    throw err;
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    await deleteProduct(id);
    logSecurity("admin product delete", { actor: admin.user.email, productId: id });
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof AdminProductNotFoundError) {
      return NextResponse.json({ error: err.message }, { status: 404 });
    }
    if (err instanceof AdminProductInUseError) {
      return NextResponse.json({ error: err.message }, { status: 409 });
    }
    throw err;
  }
}
