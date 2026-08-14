import { NextResponse } from "next/server";
import { prisma } from "@/infrastructure/prisma";
import { rateLimit, clientIp } from "@/infrastructure/redis/rate-limit";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const ip = clientIp(request);
  const limited = await rateLimit(`newsletter:${ip}`, 5, 3600);
  if (!limited.ok) {
    return NextResponse.json(
      {
        error: "Çok fazla deneme yaptınız. Lütfen bir saat sonra tekrar deneyin.",
      },
      { status: 429 }
    );
  }

  let body: { email?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "Geçerli bir e-posta girin." },
      { status: 400 }
    );
  }

  try {
    await prisma.newsletterSubscription.upsert({
      where: { email },
      update: {},
      create: { email },
    });
  } catch (err) {
    console.error("Newsletter subscribe failed:", err);
    return NextResponse.json(
      { error: "Abonelik kaydedilemedi. Lütfen tekrar deneyin." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
