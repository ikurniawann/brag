import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    ok: true,
    service: "brag",
    timestamp: new Date().toISOString()
  });
}
