"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const CRIADOR_TABS = ["Dashboard", "Minhas Soluções", "Vendas", "Configurações"];

const CATEGORIAS = [
  "Automação", "Chatbots", "Marketing", "Vendas", "Análise",
  "Produtividade", "Jurídico", "Atendimento", "Finanças", "RH",
];

const inp = {
  width: "100%", padding: "11px 14px", borderRadius: 10,
  border: "1px solid #e5e7eb", fontSize: 14, color: "#111827",
  background: "white", outline: "none", boxSizing: "border-box",
  fontFamily: "inherit", transition: "border-color 0.15s, box-shadow 0.15s",
};
const lbl = { fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6, display: "block" };

export default function NovaSolucaoPage() {
  const router = useRouter();
  const [hoveredTab, setHoveredTab] = useState(null);
  const [searchFocused, setSearchFocused] = useState(false);

  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbPreview, setThumbPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const fi = e => { e.target.style.borderColor = "#2563EB"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.1)"; };
  const fb = e => { e.target.style.borderColor = "#e5e7eb"; e.target.style.boxShadow = "none"; };

  function handleThumb(e) {
    const file = e.target.files?.[0];
    if (file) { setThumbnail(file); setThumbPreview(URL.createObjectURL(file)); }
  }

  async function handleDraft() {
    setSaving(true);
    await new Promise(r => setTimeout(r, 600));
    setSaving(false);
    router.push("/dashboard/criador/solucoes");
  }

  async function handlePublish() {
    setPublishing(true);
    await new Promise(r => setTimeout(r, 800));
    setPublishing(false);
    router.push("/dashboard/criador/solucoes");
  }

  return (
    <div style={{ background: "#f9fafb", minHeight: "100vh", fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif" }}>

      {/* NAVBAR */}
      <nav style={{
        background: "white", borderBottom: "1px solid #e5e7eb",
        padding: "0 32px", height: 60, display: "flex",
        alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 50,
      }}>
        <img src="/logo-icon.png" alt="WePrompt" style={{ height: 32, width: 160, objectFit: "cover", objectPosition: "center" }} />
        <div style={{
          display: "flex", alignItems: "center",
          background: searchFocused ? "white" : "#f3f4f6",
          borderRadius: 8, padding: "8px 16px", width: 360, gap: 8,
          border: searchFocused ? "1px solid #2563EB" : "1px solid transparent",
          boxShadow: searchFocused ? "0 0 0 3px rgba(37,99,235,0.1)" : "none",
          transition: "all 0.2s ease",
        }}>
          <svg width="16" height="16" fill="none" stroke="#9ca3af" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="M21 21l-4.35-4.35" />
          </svg>
          <input placeholder="Buscar soluções..." onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)}
            style={{ fontSize: 14, border: "none", background: "transparent", outline: "none", flex: 1, color: "#374151" }} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button style={{ fontSize: 14, fontWeight: 500, color: "#374151", cursor: "pointer", background: "none", border: "none", padding: 0 }}>Marketplace ▾</button>
          <button style={{ fontSize: 14, fontWeight: 500, color: "#374151", cursor: "pointer", background: "none", border: "none", padding: 0 }}>Vender ▾</button>
          <div style={{ width: 1, height: 20, background: "#e5e7eb" }} />
          <button style={{ background: "none", border: "none", padding: 0, cursor: "pointer", display: "flex", alignItems: "center" }}>
            <svg width="20" height="20" fill="none" stroke="#374151" strokeWidth="1.75" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
            </svg>
          </button>
          <button style={{ background: "none", border: "none", padding: 0, cursor: "pointer", position: "relative", display: "flex", alignItems: "center" }}>
            <svg width="20" height="20" fill="none" stroke="#374151" strokeWidth="1.75" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
            <span style={{ width: 8, height: 8, background: "#ef4444", borderRadius: 999, position: "absolute", top: -2, right: -2 }} />
          </button>
          <div style={{ width: 32, height: 32, background: "#7c3aed", borderRadius: 999, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>C</div>
        </div>
      </nav>

      {/* TABS ROW */}
      <div style={{ background: "white", borderBottom: "1px solid #e5e7eb", padding: "0 32px", display: "flex", gap: 0 }}>
        {CRIADOR_TABS.map((tab, i) => (
          <button key={tab}
            onClick={() => {
              if (i === 0) router.push("/dashboard/criador");
              else if (i === 1) router.push("/dashboard/criador/solucoes");
              else if (i === 2) router.push("/dashboard/criador/vendas");
              else if (i === 3) router.push("/dashboard/criador/configuracoes");
            }}
            onMouseEnter={() => setHoveredTab(i)}
            onMouseLeave={() => setHoveredTab(null)}
            style={{
              fontSize: 14, padding: "14px 20px 14px 0", marginRight: 8, cursor: "pointer",
              display: "inline-flex", alignItems: "center", border: "none",
              borderBottom: i === 1 ? "2px solid #111827" : "2px solid transparent",
              background: "transparent",
              color: i === 1 ? "#111827" : hoveredTab === i ? "#374151" : "#6b7280",
              fontWeight: i === 1 ? 600 : 400,
              marginBottom: -1, transition: "color 0.15s ease", fontFamily: "inherit", whiteSpace: "nowrap",
            }}
          >{tab}</button>
        ))}
      </div>

      {/* MAIN CONTENT */}
      <div style={{ padding: "24px 32px", maxWidth: 720 }}>

        {/* TITLE */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: 0 }}>+ Nova Solução</h1>
            <p style={{ fontSize: 14, color: "#6b7280", marginTop: 4, marginBottom: 0 }}>Preencha os dados da sua nova solução.</p>
          </div>
          <button onClick={() => router.push("/dashboard/criador/solucoes")}
            style={{ fontSize: 13, color: "#6b7280", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            ← Voltar
          </button>
        </div>

        {/* FORM */}
        <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", padding: 24 }}>

          {/* Nome */}
          <div style={{ marginBottom: 20 }}>
            <label style={lbl}>Nome da solução *</label>
            <input value={nome} onChange={e => setNome(e.target.value)} placeholder="Ex: Assistente de E-mails Pro"
              style={inp} onFocus={fi} onBlur={fb} />
          </div>

          {/* Categoria + Preço */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
            <div>
              <label style={lbl}>Categoria *</label>
              <select value={categoria} onChange={e => setCategoria(e.target.value)}
                style={{ ...inp, cursor: "pointer" }} onFocus={fi} onBlur={fb}>
                <option value="">Selecione uma categoria…</option>
                {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={lbl}>Preço (R$) *</label>
              <input type="number" value={preco} onChange={e => setPreco(e.target.value)}
                placeholder="97,00" style={inp} onFocus={fi} onBlur={fb} min="0" step="0.01" />
            </div>
          </div>

          {/* Descrição */}
          <div style={{ marginBottom: 20 }}>
            <label style={lbl}>Descrição *</label>
            <textarea rows={5} value={descricao} onChange={e => setDescricao(e.target.value)}
              placeholder="Descreva o que sua solução faz, quem é o público-alvo e quais problemas resolve…"
              style={{ ...inp, resize: "vertical", lineHeight: 1.65 }} onFocus={fi} onBlur={fb} />
          </div>

          {/* Thumbnail */}
          <div style={{ marginBottom: 8 }}>
            <label style={lbl}>Thumbnail</label>
            <div style={{
              border: "2px dashed #e5e7eb", borderRadius: 10, padding: "32px 24px",
              textAlign: "center", cursor: "pointer", position: "relative",
              background: thumbPreview ? "transparent" : "#fafafa",
              overflow: "hidden",
            }}
              onClick={() => document.getElementById("thumb-upload").click()}
              onMouseEnter={e => e.currentTarget.style.borderColor = "#2563EB"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "#e5e7eb"}
            >
              {thumbPreview
                ? <img src={thumbPreview} alt="preview" style={{ width: "100%", maxHeight: 160, objectFit: "cover", borderRadius: 8 }} />
                : (
                  <>
                    <svg width="32" height="32" fill="none" stroke="#9ca3af" strokeWidth="1.5" viewBox="0 0 24 24" style={{ margin: "0 auto 8px" }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                    <div style={{ fontSize: 14, color: "#6b7280" }}>Clique para fazer upload</div>
                    <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 4 }}>PNG, JPG ou WebP — máx 2MB</div>
                  </>
                )}
              <input id="thumb-upload" type="file" accept="image/jpeg,image/png,image/webp"
                style={{ display: "none" }} onChange={handleThumb} />
            </div>
          </div>

        </div>

        {/* ACTION BUTTONS */}
        <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
          <button type="button" onClick={handleDraft} disabled={saving}
            style={{
              padding: "11px 22px", borderRadius: 8, border: "1px solid #e5e7eb",
              background: "white", fontSize: 14, fontWeight: 500, color: "#374151",
              cursor: saving ? "not-allowed" : "pointer", fontFamily: "inherit",
              opacity: saving ? 0.6 : 1,
            }}>
            {saving ? "Salvando…" : "Salvar como rascunho"}
          </button>
          <button type="button" onClick={handlePublish} disabled={publishing}
            style={{
              padding: "11px 22px", borderRadius: 8, border: "none",
              background: publishing ? "rgba(17,24,39,0.6)" : "#111827",
              color: "white", fontSize: 14, fontWeight: 600,
              cursor: publishing ? "not-allowed" : "pointer", fontFamily: "inherit",
            }}>
            {publishing ? "Publicando…" : "Publicar →"}
          </button>
        </div>

      </div>
    </div>
  );
}
