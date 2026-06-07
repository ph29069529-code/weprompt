// This endpoint has been removed. Purchase confirmation emails are sent
// directly from the Stripe webhook handler (app/api/webhook/route.js).
import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({ error: "Gone." }, { status: 410 });
}
