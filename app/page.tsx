"use client";

import { useEffect, useState } from "react";
import type { Flag } from "@/lib/types";
import { FlagRow } from "@/components/FlagRow";
import { AddFlagForm } from "@/components/AddFlagForm";

export default function Home() {
  const [flags, setFlags] = useState<Flag[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pendingKeys, setPendingKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    let isMounted = true;

    fetch("/api/flags")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load flags");
        return res.json();
      })
      .then((data) => {
        if (isMounted) setFlags(data.flags);
      })
      .catch(() => {
        if (isMounted) setError("Couldn't load flags. Try refreshing.");
      });

    return () => {
      isMounted = false;
    };
  }, []);

  function setPending(key: string, isPending: boolean) {
    setPendingKeys((prev) => {
      const next = new Set(prev);
      if (isPending) next.add(key);
      else next.delete(key);
      return next;
    });
  }

  async function handleAdd(key: string, label: string): Promise<string | null> {
    const res = await fetch("/api/flags", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, label }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      return data?.error ?? "Failed to add flag.";
    }

    const data = await res.json();
    setFlags((prev) => (prev ? [...prev, data.flag] : [data.flag]));
    return null;
  }

  async function handleToggle(key: string, enabled: boolean) {
    const snapshot = flags;
    setPending(key, true);
    setFlags(
      (prev) =>
        prev?.map((flag) => (flag.key === key ? { ...flag, enabled } : flag)) ??
        prev,
    );

    try {
      const res = await fetch(`/api/flags/${key}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setFlags(
        (prev) => prev?.map((flag) => (flag.key === key ? data.flag : flag)) ?? prev,
      );
    } catch {
      setFlags(snapshot);
      setError("Couldn't update that flag. Please try again.");
    } finally {
      setPending(key, false);
    }
  }

  async function handleDelete(key: string) {
    const snapshot = flags;
    setPending(key, true);
    setFlags((prev) => prev?.filter((flag) => flag.key !== key) ?? prev);

    try {
      const res = await fetch(`/api/flags/${key}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
    } catch {
      setFlags(snapshot);
      setError("Couldn't delete that flag. Please try again.");
    } finally {
      setPending(key, false);
    }
  }

  return (
    <main className="flex flex-1 justify-center bg-zinc-950 px-4 py-10 sm:py-16">
      <div className="w-full max-w-2xl">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-50">
            FlagDeck
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Feature-flag admin — toggle, create, and retire flags.
          </p>
        </header>

        {error && (
          <div className="mb-4 rounded-md border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-sm text-rose-300">
            {error}
          </div>
        )}

        <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/20">
          <AddFlagForm onAdd={handleAdd} />

          {flags === null && (
            <p className="px-5 py-10 text-center text-sm text-zinc-500">
              Loading flags…
            </p>
          )}

          {flags !== null && flags.length === 0 && (
            <p className="px-5 py-10 text-center text-sm text-zinc-500">
              No flags yet — add your first one above.
            </p>
          )}

          {flags !== null && flags.length > 0 && (
            <ul>
              {flags.map((flag) => (
                <FlagRow
                  key={flag.key}
                  flag={flag}
                  isPending={pendingKeys.has(flag.key)}
                  onToggle={handleToggle}
                  onDelete={handleDelete}
                />
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}
