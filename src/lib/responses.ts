import { NextResponse } from "next/server";

export function jsonOk(data: any = {}, init: ResponseInit = {}) {
  return NextResponse.json({ ok: true, ...data }, init);
}

export function jsonError(message: string = "Error", status: number = 400) {
  return NextResponse.json({ ok: false, error: message }, { status });
}
