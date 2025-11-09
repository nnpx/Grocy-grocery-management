import { NextResponse } from "next/server";
import { getConnection } from "../../../lib/db";

export async function GET() {
  try {
    const db = await getConnection();
    const [rows] = await db.query("SELECT NOW() AS time");
    return NextResponse.json({ ok: true, db_time: rows[0].time });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false, error: err.message });
  }
}
