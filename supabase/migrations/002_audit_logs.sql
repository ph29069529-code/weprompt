-- =============================================================
-- WEPROMPT — AUDIT LOGS TABLE
-- Execute no Supabase SQL Editor
-- =============================================================

CREATE TABLE IF NOT EXISTS audit_logs (
  id          uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     uuid        REFERENCES auth.users(id) ON DELETE SET NULL,
  action      text        NOT NULL,
  resource    text,
  resource_id text,
  ip_address  text,
  user_agent  text,
  metadata    jsonb,
  created_at  timestamptz DEFAULT now()
);

-- Index for fast admin queries
CREATE INDEX IF NOT EXISTS audit_logs_user_id_idx    ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS audit_logs_action_idx     ON audit_logs(action);
CREATE INDEX IF NOT EXISTS audit_logs_created_at_idx ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS audit_logs_ip_idx         ON audit_logs(ip_address);

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can read logs
DROP POLICY IF EXISTS "Admins can read audit logs" ON audit_logs;
CREATE POLICY "Admins can read audit logs"
  ON audit_logs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
  );

-- Authenticated users (and service_role) can insert — actual writes use service_role
DROP POLICY IF EXISTS "System can insert audit logs" ON audit_logs;
CREATE POLICY "System can insert audit logs"
  ON audit_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (true);
