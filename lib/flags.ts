import { kv } from "@vercel/kv";
import type { Flag } from "./types";

const FLAGS_KEY = "flagdeck:flags";

const SEED_FLAGS: Flag[] = [
  {
    key: "new-onboarding-flow",
    label: "New onboarding flow",
    enabled: true,
    updatedAt: new Date().toISOString(),
  },
  {
    key: "ai-recommendations-beta",
    label: "AI recommendations (beta)",
    enabled: false,
    updatedAt: new Date().toISOString(),
  },
  {
    key: "experiment-checkout-v2",
    label: "Checkout v2 experiment",
    enabled: true,
    updatedAt: new Date().toISOString(),
  },
  {
    key: "dark-mode-rollout",
    label: "Dark mode rollout",
    enabled: false,
    updatedAt: new Date().toISOString(),
  },
];

export async function listFlags(): Promise<Flag[]> {
  const existing = await kv.hgetall<Record<string, Flag>>(FLAGS_KEY);

  if (!existing || Object.keys(existing).length === 0) {
    await seedFlags();
    return SEED_FLAGS;
  }

  return Object.values(existing).sort((a, b) => a.key.localeCompare(b.key));
}

async function seedFlags(): Promise<void> {
  const entries: Record<string, Flag> = {};
  for (const flag of SEED_FLAGS) {
    entries[flag.key] = flag;
  }
  await kv.hset(FLAGS_KEY, entries);
}

export async function createFlag(key: string, label: string): Promise<Flag> {
  const flag: Flag = {
    key,
    label,
    enabled: false,
    updatedAt: new Date().toISOString(),
  };
  await kv.hset(FLAGS_KEY, { [key]: flag });
  return flag;
}

export async function getFlag(key: string): Promise<Flag | null> {
  const flag = await kv.hget<Flag>(FLAGS_KEY, key);
  return flag ?? null;
}

export async function setFlagEnabled(
  key: string,
  enabled: boolean,
): Promise<Flag | null> {
  const existing = await getFlag(key);
  if (!existing) return null;

  const updated: Flag = {
    ...existing,
    enabled,
    updatedAt: new Date().toISOString(),
  };
  await kv.hset(FLAGS_KEY, { [key]: updated });
  return updated;
}

export async function deleteFlag(key: string): Promise<boolean> {
  const removed = await kv.hdel(FLAGS_KEY, key);
  return removed > 0;
}
