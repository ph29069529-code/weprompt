"use client";

import { useState, useEffect } from "react";
import WePromptLogo from "../../components/WePromptLogo";
import { supabase } from "../../lib/supabase";

const PURPLE = "#6B5CE7";
const DARK = "#0A0A1A";
const GRAY = "#6B7280";
const BORDER = "rgba(0,0,0,0.08)";
const TEXT = "#374151";

function getDashboardUrl(session) {
  if (!session) return "/login";
  const role = session.user.user_metadata?.role;
  const email = session.user.email;
  if (email === "ph29069529@gmail.com") return "/dashboard/admin";
  if (role === "criador") return "/dashboard/criador";
  return "/dashboard/empresa";
}

function useWindowSize() {
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );
  useEffect(() => {
    function onResize() { setWidth(window.innerWidth); }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return width;
}

const Arrow = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ display: "inline-block", flexShrink: 0 }}>
    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const NAV_LINKS = [
  ["Explorar", "/solucoes"],
  ["Preços", "/precos"],
  ["Como funciona", "/#como-funciona"],
  ["Para Criadores", "/criadores"],
];

function Section({ number, title, children }) {
  return (
    <div style={{ marginBottom: 48 }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 16 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10, flexShrink: 0,
          background: "rgba(107,92,231,0.08)", border: "1px solid rgba(107,92,231,0.14)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 13, fontWeight: 800, color: PURPLE,
        }}>
          {number}
        </div>
        <h2 style={{
          fontSize: 20, fontWeight: 800, color: DARK,
          margin: 0, paddingTop: 6, letterSpacing: "-0.3px",
        }}>
          {title}
        </h2>
      </div>
      <div style={{ paddingLeft: 52 }}>
        {children}
      </div>
    </div>
  );
}

function P({ children, style }) {
  return (
    <p style={{ fontSize: 15, color: TEXT, lineHeight: 1.8, marginBottom: 14, ...style }}>
      {children}
    </p>
  );
}

function Ul({ items }) {
  return (
    <ul style={{ margin: "8px 0 14px", paddingLeft: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
      {items.map((item, i) => (
        <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
          <span style={{
            width: 6, height: 6, borderRadius: "50%",
            background: PURPLE, flexShrink: 0, marginTop: 8,
          }} />
          <span style={{ fontSize: 15, color: TEXT, lineHeight: 1.7 }}>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function InfoBox({ color, bg, border, title, children }) {
  return (
    <div style={{
      background: bg, border: `1px solid ${border}`,
      borderRadius: 12, padding: "16px 20px", marginBottom: 16,
    }}>
      {title && <div style={{ fontWeight: 700, color, fontSize: 13, marginBottom: 6 }}>{title}</div>}
      <div style={{ fontSize: 14, color, lineHeight: 1.7 }}>{children}</div>
    </div>
  );
}

export default function TermosEmpresas() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [session, setSession] = useState(null);
  const width = useWindowSize();
  const isMobile = width < 768;
  const dashboardUrl = getDashboardUrl(session);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, s) => setSession(s));
    return () => subscription.unsubscribe();
  }, []);

  return (
    <div style={{
      minHeight: "100vh", color: DARK,
      background: "linear-gradient(135deg, #F0F0FF 0%, #E8E8F8 30%, #EEF0FF 60%, #F5F0FF 100%)",
    }}>

      {/* ── NAVBAR ── */}
      <header style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(0,0,0,0.07)",
      }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto",
          padding: "0 24px", height: 60,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <a href="/" style={{ textDecoration: "none", flexShrink: 0 }}>
            <WePromptLogo id="termos-e-nav" textColor={DARK} />
          </a>

          {!isMobile && (
            <nav style={{ display: "flex", alignItems: "center", gap: 2 }}>
              {NAV_LINKS.map(([label, href]) => (
                <a key={label} href={href} className="nav-link">{label}</a>
              ))}
            </nav>
          )}

          {!isMobile && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {session ? (
                <a href={dashboardUrl} className="btn-dark" style={{
                  borderRadius: 999, padding: "9px 20px", fontSize: 14, fontWeight: 600,
                  display: "inline-flex", alignItems: "center", gap: 6, textDecoration: "none",
                }}>
                  Meu Dashboard <Arrow />
                </a>
              ) : (
                <>
                  <a href="/login" style={{
                    borderRadius: 999, padding: "8px 18px", fontSize: 14, fontWeight: 500,
                    textDecoration: "none", color: DARK, border: "1.5px solid rgba(0,0,0,0.14)",
                    background: "transparent",
                  }}>Entrar</a>
                  <a href="/cadastro" className="btn-dark" style={{
                    borderRadius: 999, padding: "9px 20px", fontSize: 14, fontWeight: 600,
                    display: "inline-flex", alignItems: "center", gap: 6, textDecoration: "none",
                  }}>
                    Criar conta <Arrow />
                  </a>
                </>
              )}
            </div>
          )}

          {isMobile && (
            <button onClick={() => setMenuOpen(o => !o)} aria-label="Menu" style={{
              background: "none", border: "none", cursor: "pointer",
              fontSize: 22, color: DARK, padding: "4px 8px", display: "flex", alignItems: "center",
            }}>
              {menuOpen ? "✕" : "☰"}
            </button>
          )}
        </div>

        {isMobile && menuOpen && (
          <div style={{
            position: "fixed", top: 60, left: 0, right: 0, zIndex: 99,
            background: "rgba(255,255,255,0.97)",
            backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
            borderBottom: "1px solid rgba(0,0,0,0.07)",
            padding: "12px 24px 20px",
            display: "flex", flexDirection: "column", gap: 4,
          }}>
            {NAV_LINKS.map(([label, href]) => (
              <a key={label} href={href} onClick={() => setMenuOpen(false)} style={{
                padding: "12px 4px", fontSize: 16, fontWeight: 500,
                color: DARK, textDecoration: "none", borderBottom: "1px solid rgba(0,0,0,0.05)",
              }}>{label}</a>
            ))}
            <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
              {session ? (
                <a href={dashboardUrl} className="btn-dark" style={{
                  flex: 1, textAlign: "center", borderRadius: 999, padding: "11px",
                  fontSize: 14, fontWeight: 600,
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  textDecoration: "none",
                }}>
                  Meu Dashboard <Arrow />
                </a>
              ) : (
                <>
                  <a href="/login" style={{
                    flex: 1, textAlign: "center", borderRadius: 999, padding: "11px",
                    fontSize: 14, fontWeight: 500, textDecoration: "none", color: DARK,
                    border: "1.5px solid rgba(0,0,0,0.14)",
                  }}>Entrar</a>
                  <a href="/cadastro" className="btn-dark" style={{
                    flex: 1, textAlign: "center", borderRadius: 999, padding: "11px",
                    fontSize: 14, fontWeight: 600,
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                    textDecoration: "none",
                  }}>
                    Criar conta <Arrow />
                  </a>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      <main style={{ padding: isMobile ? "40px 16px 80px" : "64px 24px 96px" }}>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>

          {/* Page header */}
          <div style={{ marginBottom: 48 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "rgba(107,92,231,0.08)", border: "1px solid rgba(107,92,231,0.14)",
              color: PURPLE, fontSize: 12, fontWeight: 700,
              padding: "5px 14px", borderRadius: 999, marginBottom: 20, letterSpacing: "0.05em",
            }}>
              🏢 Para Empresas
            </div>
            <h1 style={{
              fontSize: isMobile ? 28 : 40, fontWeight: 800, color: DARK,
              letterSpacing: "-1px", marginBottom: 12, lineHeight: 1.15,
            }}>
              Termos e Condições para Empresas
            </h1>
            <p style={{ fontSize: 15, color: GRAY, lineHeight: 1.7, marginBottom: 20 }}>
              Estes termos regem a relação entre a WePrompt e as empresas que utilizam o marketplace
              para descobrir, comprar e assinar soluções de IA. Leia com atenção antes de criar sua conta.
            </p>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "#fff", border: `1px solid ${BORDER}`,
              borderRadius: 8, padding: "8px 14px", fontSize: 12, color: GRAY,
            }}>
              <span>Última atualização: maio de 2026</span>
              <span style={{ color: BORDER }}>·</span>
              <a href="/para-criadores/termos" style={{ color: PURPLE, fontWeight: 600, textDecoration: "none" }}>
                Ver termos para Criadores →
              </a>
            </div>
          </div>

          {/* Content card */}
          <div style={{
            background: "#fff", border: `1px solid ${BORDER}`,
            borderRadius: 20, padding: isMobile ? "32px 24px" : "56px 52px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 8px 32px rgba(0,0,0,0.04)",
          }}>

            <Section number="1" title="O que é a WePrompt">
              <P>
                A <strong>WePrompt</strong> é o primeiro marketplace de soluções de inteligência artificial da América Latina,
                projetado para o mercado brasileiro. Conectamos empresas que precisam adotar IA em seus processos com
                criadores especializados que desenvolvem agentes, automações, chatbots, prompts e integrações prontos para uso.
              </P>
              <P>
                A WePrompt atua como intermediária: hospedamos as soluções dos criadores, facilitamos a descoberta por
                parte das empresas, processamos os pagamentos com segurança e garantimos a qualidade do catálogo por
                meio de curadoria editorial e suporte em português.
              </P>
              <P>
                Ao criar uma conta como empresa na WePrompt, você concorda em seguir estes termos integralmente.
              </P>
            </Section>

            <div style={{ height: 1, background: BORDER, marginBottom: 48 }} />

            <Section number="2" title="Como funciona para Empresas">
              <P>A experiência da sua empresa na WePrompt segue estas etapas:</P>
              <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 16 }}>
                {[
                  { step: "1", title: "Cadastro", desc: "Crie sua conta gratuita selecionando o perfil \"Empresa\". Acesso imediato ao catálogo completo após o cadastro." },
                  { step: "2", title: "Exploração do catálogo", desc: "Navegue pelas categorias, use os filtros de busca, leia as descrições detalhadas e avaliações verificadas de cada solução." },
                  { step: "3", title: "Compra ou assinatura", desc: "Escolha entre compra única ou assinatura mensal, conforme o modelo da solução. O pagamento é processado de forma segura." },
                  { step: "4", title: "Acesso à solução", desc: "Após a confirmação do pagamento, você recebe o material de entrega (arquivos, links de acesso ou instruções) diretamente na plataforma." },
                  { step: "5", title: "Suporte e uso", desc: "Utilize a solução com suporte do criador e da WePrompt conforme as condições do seu plano. Em caso de problemas, abra um chamado no suporte." },
                ].map(({ step, title, desc }) => (
                  <div key={step} style={{
                    display: "flex", gap: 14, alignItems: "flex-start",
                    background: "rgba(107,92,231,0.03)", border: "1px solid rgba(107,92,231,0.08)",
                    borderRadius: 12, padding: "16px 18px",
                  }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: "50%",
                      background: PURPLE, color: "#fff",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 12, fontWeight: 800, flexShrink: 0,
                    }}>{step}</div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: DARK, marginBottom: 4 }}>{title}</div>
                      <div style={{ fontSize: 14, color: TEXT, lineHeight: 1.65 }}>{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            <div style={{ height: 1, background: BORDER, marginBottom: 48 }} />

            <Section number="3" title="Planos disponíveis para Empresas">
              <P>A WePrompt oferece três planos para empresas compradoras:</P>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
                {[
                  {
                    name: "Free — Gratuito",
                    color: GRAY,
                    bg: "#fafafa",
                    border: BORDER,
                    items: [
                      "Acesso ao catálogo completo de soluções",
                      "Compra e assinatura de soluções pelo preço cheio",
                      "Suporte via e-mail padrão",
                      "Filtros e busca avançada",
                      "Avaliações verificadas de compradores anteriores",
                    ],
                  },
                  {
                    name: "Business — R$ 197/mês (ou R$ 157/mês no anual = R$ 1.884/ano)",
                    color: PURPLE,
                    bg: "rgba(107,92,231,0.04)",
                    border: "rgba(107,92,231,0.15)",
                    items: [
                      "10% de desconto em todas as soluções do marketplace",
                      "Suporte prioritário em português (resposta em até 24h úteis)",
                      "Curadoria personalizada mensal: receba recomendações de soluções alinhadas ao seu setor",
                      "Até 3 usuários com acesso à conta da empresa",
                      "Onboarding guiado pela equipe WePrompt",
                      "Acesso antecipado a soluções em pré-lançamento",
                    ],
                  },
                  {
                    name: "Enterprise — R$ 497/mês (ou R$ 397/mês no anual = R$ 4.764/ano)",
                    color: DARK,
                    bg: "rgba(10,10,26,0.03)",
                    border: "rgba(0,0,0,0.1)",
                    items: [
                      "20% de desconto em todas as soluções do marketplace",
                      "Suporte dedicado via WhatsApp com gerente de conta WePrompt",
                      "Curadoria personalizada semanal",
                      "Usuários ilimitados na conta da empresa",
                      "Onboarding completo da equipe (sessões ao vivo)",
                      "Relatório mensal de ROI com análise das soluções contratadas",
                    ],
                  },
                ].map(({ name, color, bg, border, items }) => (
                  <div key={name} style={{
                    background: bg, border: `1px solid ${border}`, borderRadius: 12, padding: "18px 20px",
                  }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color, marginBottom: 10 }}>{name}</div>
                    <ul style={{ margin: 0, paddingLeft: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
                      {items.map((item, i) => (
                        <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                          <span style={{ width: 5, height: 5, borderRadius: "50%", background: color, flexShrink: 0, marginTop: 9 }} />
                          <span style={{ fontSize: 13, color: TEXT, lineHeight: 1.6 }}>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <P style={{ fontSize: 13 }}>
                Para mais detalhes e para comparar planos lado a lado, acesse nossa{" "}
                <a href="/precos" style={{ color: PURPLE, fontWeight: 600, textDecoration: "none" }}>página de preços</a>.
              </P>
            </Section>

            <div style={{ height: 1, background: BORDER, marginBottom: 48 }} />

            <Section number="4" title="Como funciona a curadoria da WePrompt">
              <P>
                Toda solução disponível no marketplace WePrompt passa por um processo de curadoria antes de ser publicada.
                Isso significa que você, como empresa compradora, tem a garantia de que o que está vendo no catálogo foi
                avaliado pela nossa equipe.
              </P>
              <P>O processo de curadoria inclui:</P>
              <Ul items={[
                "Verificação de funcionamento: testamos ou verificamos que a solução opera conforme descrita.",
                "Validação da descrição: confirmamos que as informações são precisas, claras e não enganosas.",
                "Checagem dos materiais de entrega: garantimos que arquivos, links e instruções estejam completos e funcionais.",
                "Avaliação de adequação ao marketplace: verificamos se a solução atende às categorias e padrões da plataforma.",
                "Revisão periódica: soluções aprovadas podem ser revisadas novamente em caso de reclamações ou atualizações significativas.",
              ]} />
              <InfoBox
                color="#B45309"
                bg="rgba(245,158,11,0.06)"
                border="rgba(245,158,11,0.2)"
                title="Importante"
              >
                A curadoria da WePrompt reduz significativamente os riscos de adquirir soluções que não funcionam,
                mas não elimina completamente a possibilidade de problemas. Por isso, temos uma política de reembolso
                clara para casos em que a solução não funcione conforme descrito.
              </InfoBox>
            </Section>

            <div style={{ height: 1, background: BORDER, marginBottom: 48 }} />

            <Section number="5" title="Política de reembolso">
              <P>
                A WePrompt oferece uma política de reembolso justa para proteger as empresas compradoras.
                O reembolso pode ser solicitado nas seguintes condições:
              </P>
              <div style={{
                background: "rgba(22,163,74,0.04)", border: "1px solid rgba(22,163,74,0.15)",
                borderRadius: 12, padding: "20px 20px", marginBottom: 16,
              }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#15803D", marginBottom: 10 }}>
                  Condições para reembolso
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {[
                    "A solicitação é feita em até 7 dias corridos após a compra ou primeiro pagamento da assinatura.",
                    "A solução não funciona conforme descrito na listagem do marketplace.",
                    "O material de entrega está incompleto, com links quebrados ou inacessível.",
                    "O criador não responde às tentativas de contato da WePrompt em até 5 dias úteis após a abertura de disputa.",
                  ].map((item, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#15803D", flexShrink: 0, marginTop: 8 }} />
                      <span style={{ fontSize: 14, color: TEXT, lineHeight: 1.65 }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{
                background: "rgba(220,38,38,0.04)", border: "1px solid rgba(220,38,38,0.12)",
                borderRadius: 12, padding: "20px 20px", marginBottom: 16,
              }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#B91C1C", marginBottom: 10 }}>
                  Situações que não geram reembolso
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {[
                    "Desistência ou mudança de plano após uso da solução.",
                    "A solução funciona conforme descrito, mas não atendeu às expectativas subjetivas do comprador.",
                    "Solicitação feita após o prazo de 7 dias.",
                    "Problemas causados por configuração incorreta por parte da empresa compradora.",
                  ].map((item, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#B91C1C", flexShrink: 0, marginTop: 8 }} />
                      <span style={{ fontSize: 14, color: TEXT, lineHeight: 1.65 }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <P>
                Para solicitar reembolso, abra um chamado em{" "}
                <a href="mailto:contato@weprompt.app.br" style={{ color: PURPLE, fontWeight: 600, textDecoration: "none" }}>
                  contato@weprompt.app.br
                </a>{" "}
                descrevendo o problema e incluindo evidências. O reembolso é processado em até 10 dias úteis após aprovação.
              </P>
            </Section>

            <div style={{ height: 1, background: BORDER, marginBottom: 48 }} />

            <Section number="6" title="Suporte em português">
              <P>
                Um dos diferenciais da WePrompt é o suporte inteiramente em português do Brasil.
                Veja o que está incluído em cada plano:
              </P>
              <div style={{
                background: "#fafafa", border: `1px solid ${BORDER}`, borderRadius: 12, overflow: "hidden", marginBottom: 16,
              }}>
                {[
                  { plano: "Free", tipo: "E-mail", prazo: "Até 3 dias úteis", canal: "contato@weprompt.app.br" },
                  { plano: "Business", tipo: "E-mail prioritário", prazo: "Até 24 horas úteis", canal: "Fila prioritária" },
                  { plano: "Enterprise", tipo: "WhatsApp dedicado", prazo: "Até 4 horas úteis", canal: "Gerente de conta" },
                ].map((row, i) => (
                  <div key={row.plano} style={{
                    padding: "16px 20px", borderTop: i > 0 ? `1px solid ${BORDER}` : "none",
                    display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center",
                  }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: DARK, width: 90, flexShrink: 0 }}>{row.plano}</div>
                    <div style={{ fontSize: 13, color: TEXT, flex: "1 1 120px" }}>{row.tipo}</div>
                    <div style={{ fontSize: 13, color: PURPLE, fontWeight: 600, flex: "1 1 120px" }}>{row.prazo}</div>
                    <div style={{ fontSize: 12, color: GRAY, flex: "1 1 120px" }}>{row.canal}</div>
                  </div>
                ))}
              </div>
              <P>
                O suporte cobre dúvidas sobre o uso da plataforma, problemas com soluções adquiridas,
                processos de reembolso e gerenciamento da conta. Questões específicas sobre o funcionamento
                interno de uma solução devem ser direcionadas ao criador da solução.
              </P>
            </Section>

            <div style={{ height: 1, background: BORDER, marginBottom: 48 }} />

            <Section number="7" title="Responsabilidades da WePrompt">
              <P>A WePrompt se compromete a:</P>
              <Ul items={[
                "Manter o marketplace disponível e funcional, com meta de uptime de 99% ao mês.",
                "Garantir que todas as soluções no catálogo passaram pelo processo de curadoria.",
                "Processar pagamentos com segurança e emitir comprovantes de transação.",
                "Aplicar a política de reembolso de forma justa e dentro dos prazos estabelecidos.",
                "Mediar disputas entre empresas e criadores de forma neutra.",
                "Proteger os dados das empresas conforme a LGPD e nossa Política de Privacidade.",
                "Comunicar antecipadamente qualquer alteração significativa nos termos ou nos preços dos planos.",
              ]} />
              <P>
                A WePrompt não se responsabiliza por perdas de negócios, perda de dados ou danos indiretos
                decorrentes do uso ou da incapacidade de uso das soluções adquiridas no marketplace.
                Nossa responsabilidade máxima em qualquer caso fica limitada ao valor total pago pelo
                comprador nos últimos 12 meses.
              </P>
            </Section>

            <div style={{ height: 1, background: BORDER, marginBottom: 48 }} />

            <Section number="8" title="Responsabilidades da Empresa compradora">
              <P>Como empresa compradora na WePrompt, você é responsável por:</P>
              <Ul items={[
                "Fornecer informações verdadeiras e atualizadas no cadastro da sua empresa.",
                "Manter os dados de pagamento válidos e atualizados para evitar interrupções no serviço.",
                "Usar as soluções adquiridas conforme os termos de uso do criador e da WePrompt.",
                "Não compartilhar credenciais de acesso às soluções com pessoas não autorizadas ou fora da sua organização.",
                "Reportar imediatamente à WePrompt qualquer suspeita de fraude, uso indevido ou problema técnico.",
                "Respeitar os direitos de propriedade intelectual dos criadores cujas soluções você adquiriu.",
              ]} />
            </Section>

            <div style={{ height: 1, background: BORDER, marginBottom: 48 }} />

            <Section number="9" title="Uso aceitável das soluções compradas">
              <P>
                As soluções adquiridas na WePrompt são licenciadas para uso pela empresa compradora.
                Salvo autorização expressa do criador, é proibido:
              </P>
              <Ul items={[
                "Revender ou redistribuir a solução para terceiros fora da sua organização.",
                "Criar produtos derivados para comercialização com base nas soluções adquiridas, sem autorização do criador.",
                "Fazer engenharia reversa, descompilar ou tentar extrair o código-fonte de soluções fechadas.",
                "Usar as soluções para fins ilegais, discriminatórios ou que violem a LGPD e outras leis aplicáveis.",
                "Usar as soluções para treinar modelos de IA próprios sem autorização explícita do criador.",
              ]} />
              <P>
                O descumprimento destas regras pode resultar no cancelamento do acesso à solução e da conta
                da empresa na WePrompt, sem direito a reembolso.
              </P>
            </Section>

            <div style={{ height: 1, background: BORDER, marginBottom: 48 }} />

            <Section number="10" title="Disputas com Criadores">
              <P>
                Se você tiver um problema com uma solução adquirida, siga este processo:
              </P>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
                {[
                  { n: "1", t: "Contate o criador diretamente", d: "Muitos problemas são resolvidos diretamente com o criador. Use o canal de suporte da solução ou o perfil do criador na plataforma." },
                  { n: "2", t: "Abra uma disputa formal", d: "Se não obtiver resposta em 3 dias úteis, abra uma disputa pelo e-mail contato@weprompt.app.br. Inclua evidências do problema (prints, descrição detalhada, data da compra)." },
                  { n: "3", t: "Mediação pela WePrompt", d: "Nossa equipe notifica o criador e concede 5 dias úteis para solução. Acompanhamos o processo de perto." },
                  { n: "4", t: "Resolução", d: "Se o problema for resolvido, a disputa é encerrada. Se não, a WePrompt avalia o reembolso e pode aplicar sanções ao criador." },
                ].map(({ n, t, d }) => (
                  <div key={n} style={{
                    display: "flex", gap: 14, alignItems: "flex-start",
                    background: "#fafafa", border: `1px solid ${BORDER}`,
                    borderRadius: 10, padding: "14px 16px",
                  }}>
                    <div style={{
                      width: 26, height: 26, borderRadius: "50%",
                      background: "rgba(107,92,231,0.1)", color: PURPLE,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 12, fontWeight: 800, flexShrink: 0,
                    }}>{n}</div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: DARK, marginBottom: 4 }}>{t}</div>
                      <div style={{ fontSize: 13, color: TEXT, lineHeight: 1.65 }}>{d}</div>
                    </div>
                  </div>
                ))}
              </div>
              <P>
                Decisões da WePrompt em disputas são finais dentro da plataforma, mas não excluem o direito
                de buscar resolução por vias legais externas.
              </P>
            </Section>

            <div style={{ height: 1, background: BORDER, marginBottom: 48 }} />

            <Section number="11" title="Privacidade e LGPD">
              <P>
                A WePrompt está comprometida com a proteção dos seus dados pessoais e da sua empresa,
                em conformidade com a <strong>Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018)</strong>.
              </P>
              <P>Dados coletados e suas finalidades:</P>
              <Ul items={[
                "Dados de cadastro (nome, e-mail, CNPJ): identificação, autenticação e emissão de documentos fiscais.",
                "Dados de pagamento: processados por gateway de pagamento certificado PCI-DSS. A WePrompt não armazena dados de cartão.",
                "Dados de uso da plataforma (soluções vistas, compradas, tempo de sessão): melhoria da experiência e personalização de recomendações.",
                "Comunicações por e-mail: confirmações de compra, suporte e comunicados importantes sobre a plataforma.",
              ]} />
              <P>
                Você tem o direito de acessar, corrigir, exportar ou solicitar a exclusão dos seus dados
                a qualquer momento. Para exercer esses direitos, entre em contato em{" "}
                <a href="mailto:contato@weprompt.app.br" style={{ color: PURPLE, fontWeight: 600, textDecoration: "none" }}>
                  contato@weprompt.app.br
                </a>.
              </P>
              <P>
                A WePrompt não vende dados de empresas ou usuários a terceiros. Dados podem ser
                compartilhados apenas com criadores (para fins de entrega da solução) e com
                fornecedores de serviços essenciais (pagamento, hospedagem) sob contrato de
                confidencialidade e proteção de dados.
              </P>
              <InfoBox
                color={PURPLE}
                bg="rgba(107,92,231,0.05)"
                border="rgba(107,92,231,0.12)"
                title="Retenção de dados"
              >
                Dados de conta são mantidos enquanto a conta estiver ativa. Após o encerramento da conta,
                dados são removidos em até 90 dias, exceto quando obrigações legais ou fiscais exigirem
                retenção por período maior.
              </InfoBox>
            </Section>

            <div style={{ height: 1, background: BORDER, marginBottom: 48 }} />

            <Section number="12" title="Alterações nestes Termos">
              <P>
                A WePrompt pode atualizar estes Termos a qualquer momento. Em caso de alterações significativas
                que afetem seus direitos ou obrigações como empresa compradora, você será notificado por e-mail
                com pelo menos <strong>30 dias de antecedência</strong>.
              </P>
              <P>
                Ajustes menores (esclarecimentos, correções gramaticais) podem ser feitos sem notificação prévia.
                A data de "Última atualização" no topo desta página sempre refletirá a versão em vigor.
              </P>
              <P>
                O uso continuado da plataforma após a data de vigência das novas condições constitui
                aceitação das mesmas. Se você discordar das alterações, pode encerrar sua conta antes
                da data de vigência.
              </P>
              <P>
                Em caso de dúvidas sobre qualquer alteração, entre em contato antes da data de vigência
                pelo e-mail{" "}
                <a href="mailto:contato@weprompt.app.br" style={{ color: PURPLE, fontWeight: 600, textDecoration: "none" }}>
                  contato@weprompt.app.br
                </a>.
              </P>
            </Section>

            {/* Contact box */}
            <div style={{
              background: "rgba(107,92,231,0.05)", border: "1px solid rgba(107,92,231,0.12)",
              borderRadius: 16, padding: "28px 28px", textAlign: "center",
            }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: DARK, marginBottom: 8 }}>
                Dúvidas sobre estes termos?
              </div>
              <p style={{ fontSize: 14, color: GRAY, lineHeight: 1.7, marginBottom: 20 }}>
                Nossa equipe está pronta para esclarecer qualquer questão sobre planos,
                reembolsos, privacidade ou uso das soluções.
              </p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                <a href="mailto:contato@weprompt.app.br" style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  borderRadius: 999, padding: "11px 24px",
                  background: PURPLE, color: "#fff",
                  fontSize: 14, fontWeight: 600, textDecoration: "none",
                }}>
                  Falar com a equipe <Arrow />
                </a>
                <a href="/para-criadores/termos" style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  borderRadius: 999, padding: "11px 24px",
                  border: `1.5px solid ${BORDER}`, color: DARK,
                  fontSize: 14, fontWeight: 600, textDecoration: "none",
                  background: "transparent",
                }}>
                  Ver termos para Criadores
                </a>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* ── FOOTER ── */}
      <footer style={{ background: "#F3F4F6", borderTop: "1px solid rgba(0,0,0,0.07)", padding: "40px 24px" }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto",
          display: "flex", flexDirection: isMobile ? "column" : "row",
          alignItems: "center", justifyContent: "space-between",
          gap: 16, textAlign: isMobile ? "center" : "left",
        }}>
          <a href="/" style={{ textDecoration: "none" }}>
            <WePromptLogo id="termos-e-footer" textColor={DARK} />
          </a>
          <p style={{ fontSize: 13, color: GRAY, margin: 0 }}>
            © 2026 WePrompt. O 1º marketplace de IA da América Latina.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 20 }}>
            <a href="/para-criadores/termos" className="footer-link">Termos para Criadores</a>
            <a href="/para-empresas/termos" className="footer-link" style={{ color: PURPLE, fontWeight: 600 }}>Termos para Empresas</a>
            <a href="mailto:contato@weprompt.app.br" className="footer-link">Contato</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
