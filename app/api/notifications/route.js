/*
 * Run once in Supabase SQL editor:
 *
 * CREATE TABLE IF NOT EXISTS notifications (
 *   id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
 *   user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
 *   type text NOT NULL,
 *   title text NOT NULL,
 *   message text NOT NULL,
 *   link text,
 *   read_at timestamptz,
 *   created_at timestamptz DEFAULT now()
 * );
 * CREATE INDEX IF NOT EXISTS notifications_user_id_idx ON notifications(user_id);
 * CREATE INDEX IF NOT EXISTS notifications_created_at_idx ON notifications(created_at DESC);
 */

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET(request) {
  const token = request.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) {
    return NextResponse.json({ error: "Autenticação necessária." }, { status: 401 });
  }

  const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
  if (authError || !user) {
    return NextResponse.json({ error: "Token inválido." }, { status: 401 });
  }

  const { data: notifications, error } = await supabaseAdmin
    .from("notifications")
    .select("id, type, title, message, link, read_at, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const unread_count = (notifications || []).filter(n => !n.read_at).length;

  return NextResponse.json({ notifications: notifications || [], unread_count });
}
