import { Redis } from "ioredis";

const globalForRedis = globalThis as unknown as {
  redis: Redis | undefined;
};

const REDIS_URL =
  process.env.REDIS_URL ?? "redis://localhost:6379";

function createRedis(): Redis {
  const client = new Redis(REDIS_URL, {
    maxRetriesPerRequest: 1,
    lazyConnect: true,
  });
  client.on("error", (err) => {
    if (process.env.NODE_ENV !== "production") {
      console.error("[redis]", err.message);
    }
  });
  return client;
}

export const redis = globalForRedis.redis ?? createRedis();

if (process.env.NODE_ENV !== "production") {
  globalForRedis.redis = redis;
}
