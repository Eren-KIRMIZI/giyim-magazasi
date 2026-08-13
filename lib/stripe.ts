import Stripe from "stripe";

export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || key.includes("xxx")) {
    return null;
  }
  return new Stripe(key, {
    apiVersion: "2026-07-29.dahlia",
  });
}
