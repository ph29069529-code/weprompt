import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function generateMetadata({ params }) {
  const { id } = await params;
  const { data } = await supabaseAdmin
    .from("profiles")
    .select("nome, bio, avatar_url")
    .eq("id", id)
    .single();

  if (!data) return { title: "Criador não encontrado — WePrompt" };

  const title = `${data.nome} — Criador no WePrompt`;
  const description = data.bio?.slice(0, 160) || `Confira as soluções de IA de ${data.nome} no WePrompt.`;
  const image = data.avatar_url || "/og-image.png";

  return {
    title,
    description,
    openGraph: {
      title, description,
      images: [{ url: image, width: 1200, height: 630, alt: data.nome }],
      type: "profile", siteName: "WePrompt",
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export default function Layout({ children }) {
  return <>{children}</>;
}
