"use client";

import { useState } from "react";

interface AddFlagFormProps {
  onAdd: (key: string, label: string) => Promise<string | null>;
}

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function AddFlagForm({ onAdd }: AddFlagFormProps) {
  const [label, setLabel] = useState("");
  const [key, setKey] = useState("");
  const [keyEdited, setKeyEdited] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    const finalKey = keyEdited ? slugify(key) : slugify(label);
    if (!finalKey || !label.trim()) {
      setError("Label and key are required.");
      return;
    }

    setIsSubmitting(true);
    const failure = await onAdd(finalKey, label.trim());
    setIsSubmitting(false);

    if (failure) {
      setError(failure);
      return;
    }

    setLabel("");
    setKey("");
    setKeyEdited(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border-b border-zinc-800/80 bg-zinc-900/40 px-5 py-4"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label className="mb-1 block text-xs font-medium text-zinc-400" htmlFor="label">
            Label
          </label>
          <input
            id="label"
            value={label}
            onChange={(event) => setLabel(event.target.value)}
            placeholder="New search ranking model"
            className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-lime-400 focus:outline-none"
          />
        </div>

        <div className="flex-1">
          <label className="mb-1 block text-xs font-medium text-zinc-400" htmlFor="key">
            Key
          </label>
          <input
            id="key"
            value={keyEdited ? key : slugify(label)}
            onChange={(event) => {
              setKeyEdited(true);
              setKey(event.target.value);
            }}
            placeholder="new-search-ranking-model"
            className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 font-mono text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-lime-400 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="shrink-0 rounded-md bg-lime-400 px-4 py-2 text-sm font-semibold text-zinc-950 transition-colors hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Adding…" : "Add flag"}
        </button>
      </div>

      {error && <p className="mt-2 text-xs text-rose-400">{error}</p>}
    </form>
  );
}
