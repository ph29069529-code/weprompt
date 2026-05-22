// Usage: node scripts/seed-solutions.js
// Requires .env.local with NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY

const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

// Load .env.local manually (no dotenv dependency needed)
function loadEnv() {
  const envPath = path.join(__dirname, "../.env.local");
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, "utf8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const value = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing env vars. Add to .env.local:");
  console.error("  NEXT_PUBLIC_SUPABASE_URL=...");
  console.error("  SUPABASE_SERVICE_ROLE_KEY=...");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

const PLACEHOLDER_CREATOR_ID = "00000000-0000-0000-0000-000000000001";

const solutions = [
  {
    titulo: "Agente de Atendimento ao Cliente",
    categoria: "Agentes de IA",
    preco: 197,
    descricao:
      "Agente de IA treinado para responder dúvidas de clientes automaticamente via WhatsApp e email. Reduz em até 70% o tempo de suporte. Fácil integração com qualquer negócio.",
    creator_id: PLACEHOLDER_CREATOR_ID,
    ativo: true,
  },
  {
    titulo: "Gerador de Conteúdo para Instagram",
    categoria: "Marketing IA",
    preco: 97,
    descricao:
      "Gera automaticamente legendas, hashtags e sugestões de pauta para Instagram com base no nicho do seu negócio. Produza 30 dias de conteúdo em menos de 1 hora.",
    creator_id: PLACEHOLDER_CREATOR_ID,
    ativo: true,
  },
  {
    titulo: "Automação de Prospecção B2B",
    categoria: "Automação",
    preco: 297,
    descricao:
      "Automatiza a busca e qualificação de leads B2B. Integra com LinkedIn e envia mensagens personalizadas automaticamente. Aumente sua prospecção em 10x sem aumentar a equipe.",
    creator_id: PLACEHOLDER_CREATOR_ID,
    ativo: true,
  },
];

async function seed() {
  console.log(`Inserting ${solutions.length} demo solutions…\n`);

  const { data, error } = await supabase
    .from("solutions")
    .insert(solutions)
    .select("id, titulo");

  if (error) {
    console.error("Insert failed:", error.message);
    process.exit(1);
  }

  console.log("Inserted successfully:");
  for (const row of data) {
    console.log(`  ✓ ${row.id}  —  ${row.titulo}`);
  }
}

seed();
