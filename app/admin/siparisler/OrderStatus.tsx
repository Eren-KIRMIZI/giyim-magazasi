"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const STATUSES = [
  "PENDING",
  "PAID",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "REFUNDED",
  "FAILED",
];

export default function OrderStatus({
  orderId,
  status,
}: {
  orderId: string;
  status: string;
}) {
  const router = useRouter();
  const [value, setValue] = useState(status);
  const [saving, setSaving] = useState(false);

  const handleChange = async (next: string) => {
    if (next === value) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Güncellenemedi.");
      setValue(next);
      router.refresh();
    } catch (err) {
      console.error(err);
      router.refresh();
    } finally {
      setSaving(false);
    }
  };

  return (
    <select
      value={value}
      onChange={(e) => handleChange(e.target.value)}
      disabled={saving}
      className="border border-on-surface bg-transparent px-3 py-2 font-label-mono text-label-mono uppercase text-on-surface focus:outline-none focus:border-primary disabled:opacity-50"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
