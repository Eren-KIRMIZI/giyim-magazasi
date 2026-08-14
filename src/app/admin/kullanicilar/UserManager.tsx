"use client";

import { useState } from "react";

interface UserRow {
  id: string;
  email: string;
  name: string | null;
  role: string;
  orderCount: number;
  reviewCount: number;
  createdAt: string;
}

export default function UserManager({
  initialUsers,
  currentUserId,
}: {
  initialUsers: UserRow[];
  currentUserId: string;
}) {
  const [users, setUsers] = useState(initialUsers);
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const handleSearch = async () => {
    setError("");
    setSearching(true);
    try {
      const res = await fetch(`/api/admin/users?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Arama başarısız.");
      setUsers(data.users);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu.");
    } finally {
      setSearching(false);
    }
  };

  const handleRole = async (user: UserRow, role: string) => {
    setError("");
    setBusyId(user.id);
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Güncellenemedi.");
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, role } : u))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu.");
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (user: UserRow) => {
    if (!window.confirm(`${user.email} silinsin mi?`)) return;
    setError("");
    setBusyId(user.id);
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Silinemedi.");
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="flex flex-col gap-stack-md">
      <div className="flex flex-col md:flex-row gap-gutter max-w-2xl">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
          placeholder="E-posta veya ad ara..."
          className="flex-1 border border-on-surface bg-transparent px-4 py-3 font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary"
        />
        <button
          type="button"
          onClick={handleSearch}
          disabled={searching}
          className="bg-on-surface text-surface font-headline-md text-headline-md uppercase px-6 py-3 hover:bg-primary hover:text-on-primary transition-colors disabled:opacity-60"
        >
          {searching ? "..." : "Ara"}
        </button>
        <button
          type="button"
          onClick={() => {
            setQuery("");
            setSearching(true);
            fetch("/api/admin/users")
              .then((r) => r.json())
              .then((data) => setUsers(data.users))
              .catch(() => setError("Yeniden yüklenemedi."))
              .finally(() => setSearching(false));
          }}
          className="font-label-mono text-label-mono uppercase border border-on-surface px-4 py-3 hover:bg-on-surface hover:text-surface transition-colors"
        >
          Sıfırla
        </button>
      </div>

      {error && (
        <p className="font-label-mono text-label-mono uppercase text-error">{error}</p>
      )}

      <div className="flex flex-col border border-on-surface divide-y divide-on-surface">
        {users.length === 0 && (
          <div className="p-stack-md font-body-md text-body-md text-on-surface-variant">
            Kullanıcı bulunamadı.
          </div>
        )}
        {users.map((u) => (
          <div key={u.id} className="p-stack-md flex items-center gap-4">
            <div className="flex-1 min-w-0 flex flex-col gap-1">
              <span className="font-label-mono text-label-mono uppercase text-on-surface truncate">
                {u.email}
                {u.id === currentUserId ? " (siz)" : ""}
              </span>
              <span className="font-label-mono text-label-mono uppercase text-on-surface-variant">
                {u.name ?? "—"} · {u.orderCount} sipariş · {u.reviewCount} yorum ·{" "}
                {new Date(u.createdAt).toLocaleDateString("tr-TR")}
              </span>
            </div>
            <select
              value={u.role}
              onChange={(e) => handleRole(u, e.target.value)}
              disabled={busyId === u.id}
              className="border border-on-surface bg-transparent px-3 py-2 font-label-mono text-label-mono uppercase text-on-surface focus:outline-none disabled:opacity-50"
            >
              <option value="CUSTOMER">CUSTOMER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
            <button
              type="button"
              onClick={() => handleDelete(u)}
              disabled={busyId === u.id || u.id === currentUserId}
              className="font-label-mono text-label-mono uppercase border border-on-surface px-3 py-2 text-error hover:bg-error hover:text-on-error transition-colors disabled:opacity-50"
            >
              Sil
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
