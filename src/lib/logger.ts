export function logSecurity(
  event: string,
  detail: Record<string, unknown> = {}
) {
  console.warn(
    `[security] ${event}`,
    JSON.stringify({ ...detail, ts: new Date().toISOString() })
  );
}
