import { NextResponse } from "next/server";
import { requireAdmin } from "@/modules/auth";
import {
  createProduct,
  AdminProductValidationError,
  AdminProductSlugConflictError,
  AdminProductCategoryError,
} from "@/modules/admin";
import { revalidateStorefront } from "@/lib/revalidate";

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  try {
    const product = await createProduct(body);
    revalidateStorefront();
    return NextResponse.json({ product }, { status: 201 });
  } catch (err) {
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
