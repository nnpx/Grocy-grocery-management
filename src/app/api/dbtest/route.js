import { NextResponse } from "next/server";
import { getConnection } from "../../../lib/db";

export async function GET() {
  try {
    const db = await getConnection();
    const [rows] = await db.query("SELECT NOW() AS time");
    const [rows1] = await db.query("SELECT username FROM users");
    return NextResponse.json({ ok: true, db_time: rows[0].time, users: rows1 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false, error: err.message });
  }
}
