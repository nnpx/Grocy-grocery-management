import { NextResponse } from 'next/server';

export async function GET(request) {
  const data = {
    ok: true,
    service: "grocy-api",
    version: "0.1",
    now: new Date().toISOString(),
  };

  return NextResponse.json(data);
}
