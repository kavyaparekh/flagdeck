import { NextRequest } from "next/server";
import { PASSCODE_HEADER } from "./passcode";

export function hasValidPasscode(request: NextRequest): boolean {
  const required = process.env.NEXT_PUBLIC_ACCESS_PASSCODE;
  if (!required) return true; // no passcode configured (e.g. local dev) — allow through

  return request.headers.get(PASSCODE_HEADER) === required;
}
