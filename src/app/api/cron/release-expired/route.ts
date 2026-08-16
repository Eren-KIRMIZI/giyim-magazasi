import { NextResponse } from "next/server";
import { releaseExpiredReservations } from "@/modules/checkout";
import { revalidateStorefront } from "@/lib/revalidate";

const CRON_SECRET = process.env.CRON_SECRET ?? "";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const auth = request.headers.get("authorization");
  const secret = auth?.replace(/^Bearer\s+/i, "") ?? "";
  if (!CRON_SECRET || secret !== CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const released = await releaseExpiredReservations();
    if (released > 0) revalidateStorefront();
    return NextResponse.json({ ok: true, released });
  } catch (err) {
    console.error("release-expired cron failed:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
