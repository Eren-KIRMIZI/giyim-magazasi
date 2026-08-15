import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/infrastructure/prisma";
import { rateLimit, clientIp } from "@/infrastructure/redis/rate-limit";
import { logSecurity } from "@/lib/logger";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_RE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

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

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "Geçerli bir e-posta girin." },
      { status: 400 }
    );
  }
  if (!password || !PASSWORD_RE.test(password)) {
    return NextResponse.json(
      {
        error:
          "Şifre en az 8 karakter olmalı ve büyük/küçük harf ile rakam içermelidir.",
      },
      { status: 400 }
    );
  }

  try {
    const user = await prisma.user.create({
      data: {
        email,
        name: name || email.split("@")[0],
        passwordHash: await bcrypt.hash(password, 12),
      },
      select: { id: true, email: true, name: true },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (err) {
    // Benzersiz e-posta ihlali: kullanıcı enumeration'ı önlemek için genel mesaj
    if ((err as { code?: string } | null)?.code === "P2002") {
      logSecurity("register duplicate attempt", { email });
      return NextResponse.json(
        { error: "Kayıt oluşturulamadı. Lütfen bilgilerinizi kontrol edin." },
        { status: 400 }
      );
    }
    throw err;
  }
}
