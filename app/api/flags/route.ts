import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createFlag, getFlag, listFlags } from "@/lib/flags";
import { hasValidPasscode } from "@/lib/auth";

const createFlagSchema = z.object({
  key: z
    .string()
    .trim()
    .min(1)
    .max(64)
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "key must be kebab-case (a-z, 0-9, -)"),
  label: z.string().trim().min(1).max(120),
});

export async function GET() {
  const flags = await listFlags();
  return NextResponse.json({ flags });
}

export async function POST(request: NextRequest) {
  if (!hasValidPasscode(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = createFlagSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }

  const existing = await getFlag(parsed.data.key);
  if (existing) {
    return NextResponse.json(
      { error: `Flag with key "${parsed.data.key}" already exists` },
      { status: 409 },
    );
  }

  const flag = await createFlag(parsed.data.key, parsed.data.label);
  return NextResponse.json({ flag }, { status: 201 });
}
