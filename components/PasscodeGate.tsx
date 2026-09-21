"use client";

import { useEffect, useState } from "react";
import { getStoredPasscode, setStoredPasscode } from "@/lib/passcode";

const REQUIRED_PASSCODE = process.env.NEXT_PUBLIC_ACCESS_PASSCODE;

export function PasscodeGate({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    // sessionStorage is only readable client-side, after mount — this one-time
    // sync can't be expressed as a lazy useState initializer without an SSR/hydration mismatch.
    const stored = getStoredPasscode();
    if (!REQUIRED_PASSCODE || stored === REQUIRED_PASSCODE) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUnlocked(true);
    }
    setHasChecked(true);
  }, []);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (input === REQUIRED_PASSCODE) {
      setStoredPasscode(input);
      setUnlocked(true);
      setError(false);
    } else {
      setError(true);
    }
  }

  if (!hasChecked) return null;

  if (!unlocked) {
    return (
      <main className="flex flex-1 items-center justify-center bg-zinc-950 px-4">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm rounded-xl border border-zinc-800 bg-zinc-900/40 p-6"
        >
          <h1 className="text-lg font-semibold text-zinc-50">FlagDeck</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Enter the shared passcode to continue.
          </p>
          <input
            type="password"
            autoFocus
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Passcode"
            className="mt-4 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus:border-lime-400 focus:outline-none"
          />
          {error && (
            <p className="mt-2 text-xs text-rose-400">Incorrect passcode.</p>
          )}
          <button
            type="submit"
            className="mt-4 w-full rounded-md bg-lime-400 px-4 py-2 text-sm font-semibold text-zinc-950 transition-colors hover:bg-lime-300"
          >
            Unlock
          </button>
        </form>
      </main>
    );
  }

  return <>{children}</>;
}
