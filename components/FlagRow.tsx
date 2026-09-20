import type { Flag } from "@/lib/types";
import { relativeTime } from "@/lib/relative-time";
import { Toggle } from "./Toggle";

interface FlagRowProps {
  flag: Flag;
  isPending?: boolean;
  onToggle: (key: string, enabled: boolean) => void;
  onDelete: (key: string) => void;
}

export function FlagRow({ flag, isPending, onToggle, onDelete }: FlagRowProps) {
  return (
    <li className="group flex items-center gap-4 border-b border-zinc-800/80 px-5 py-4 transition-colors hover:bg-zinc-900/60">
      <Toggle
        checked={flag.enabled}
        disabled={isPending}
        onChange={() => onToggle(flag.key, !flag.enabled)}
        label={`Toggle ${flag.label}`}
      />

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-zinc-100">{flag.label}</p>
        <p className="truncate font-mono text-xs text-zinc-500">{flag.key}</p>
      </div>

      <span
        className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium tracking-wide uppercase ${
          flag.enabled
            ? "bg-lime-400/10 text-lime-400"
            : "bg-zinc-700/40 text-zinc-400"
        }`}
      >
        {flag.enabled ? "on" : "off"}
      </span>

      <span className="hidden shrink-0 text-xs text-zinc-500 sm:block">
        updated {relativeTime(flag.updatedAt)}
      </span>

      <button
        type="button"
        onClick={() => onDelete(flag.key)}
        disabled={isPending}
        aria-label={`Delete ${flag.label}`}
        className="shrink-0 rounded-md px-2 py-1 text-xs font-medium text-zinc-500 opacity-0 transition-colors duration-150 group-hover:opacity-100 hover:bg-rose-500/10 hover:text-rose-400 focus-visible:opacity-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Delete
      </button>
    </li>
  );
}
