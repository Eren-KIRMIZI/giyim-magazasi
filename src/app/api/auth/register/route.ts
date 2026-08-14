import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/infrastructure/prisma";
import { rateLimit, clientIp } from "@/infrastructure/redis/rate-limit";

export async function POST(req: Request) {
  const ip = clientIp(req);
  const limited = await rateLimit(`register:${ip}`, 10, 900);
  if (!limited.ok) {
    return NextResponse.json(
      {
        error: "Çok fazla deneme yaptınız. Lütfen birkaç dakika sonra tekrar deneyin.",
      },
      { status: 429 }
    );
  }

  let body: { name?: string; email?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  const name = body.name?.trim();
  const email = body.email?.trim().toLowerCase();
  const password = body.password;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "Geçerli bir e-posta girin." },
      { status: 400 }
    );
  }
  if (!password || password.length < 6) {
    return NextResponse.json(
      { error: "Şifre en az 6 karakter olmalı." },
      { status: 400 }
    );
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { error: "Bu e-posta zaten kayıtlı." },
      { status: 409 }
    );
  }

  const user = await prisma.user.create({
    data: {
      email,
      name: name || email.split("@")[0],
      passwordHash: await bcrypt.hash(password, 12),
    },
    select: { id: true, email: true, name: true },
  });

  return NextResponse.json({ user }, { status: 201 });
}
