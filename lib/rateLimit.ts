import { redis } from "@/lib/redis";

export interface RateLimitResult {
  ok: boolean;
  remaining: number;
}

export async function rateLimit(
  identifier: string,
  limit = 10,
  windowSec = 900
): Promise<RateLimitResult> {
  try {
    const key = `rate:${identifier}`;
    const count = await redis.incr(key);
    if (count === 1) {
      await redis.expire(key, windowSec);
    }
    return { ok: count <= limit, remaining: Math.max(0, limit - count) };
  } catch {
    return { ok: true, remaining: limit };
  }
}

export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}
