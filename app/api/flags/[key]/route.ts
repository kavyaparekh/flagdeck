import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { deleteFlag, setFlagEnabled } from "@/lib/flags";

const patchFlagSchema = z.object({
  enabled: z.boolean(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> },
) {
  const { key } = await params;
  const body = await request.json().catch(() => null);
  const parsed = patchFlagSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }

  const flag = await setFlagEnabled(key, parsed.data.enabled);
  if (!flag) {
    return NextResponse.json({ error: "Flag not found" }, { status: 404 });
  }

  return NextResponse.json({ flag });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ key: string }> },
) {
  const { key } = await params;
  const removed = await deleteFlag(key);

  if (!removed) {
    return NextResponse.json({ error: "Flag not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
