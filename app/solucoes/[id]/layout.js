import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function generateMetadata({ params }) {
  const { id } = await params;
  const { data } = await supabaseAdmin
    .from("solutions")
    .select("titulo, descricao, cover_url")
    .eq("id", id)
    .single();

  if (!data) {
    return {
      title: "Solução não encontrada — WePrompt",
    };
  }

  const title = `${data.titulo} — WePrompt`;
  const description = data.descricao?.slice(0, 160) || "Solução de IA pronta para usar no seu negócio.";
  const image = data.cover_url || "/og-image.png";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: data.titulo }],
      type: "website",
      siteName: "WePrompt",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default function SolucaoLayout({ children }) {
  return children;
}
