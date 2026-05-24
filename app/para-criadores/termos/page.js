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

export default function TermosCriadores() {
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
            <WePromptLogo id="termos-c-nav" textColor={DARK} />
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
                  <a href="/cadastro?role=criador" className="btn-dark" style={{
                    borderRadius: 999, padding: "9px 20px", fontSize: 14, fontWeight: 600,
                    display: "inline-flex", alignItems: "center", gap: 6, textDecoration: "none",
                  }}>
                    Começar a criar <Arrow />
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
                  <a href="/cadastro?role=criador" className="btn-dark" style={{
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
              ✦ Para Criadores
            </div>
            <h1 style={{
              fontSize: isMobile ? 28 : 40, fontWeight: 800, color: DARK,
              letterSpacing: "-1px", marginBottom: 12, lineHeight: 1.15,
            }}>
              Termos e Condições para Criadores
            </h1>
            <p style={{ fontSize: 15, color: GRAY, lineHeight: 1.7, marginBottom: 20 }}>
              Estes termos regem a relação entre a WePrompt e os criadores que publicam soluções de IA no marketplace.
              Leia com atenção antes de criar sua conta ou publicar uma solução.
            </p>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "#fff", border: `1px solid ${BORDER}`,
              borderRadius: 8, padding: "8px 14px", fontSize: 12, color: GRAY,
            }}>
              <span>Última atualização: maio de 2026</span>
              <span style={{ color: BORDER }}>·</span>
              <a href="/para-empresas/termos" style={{ color: PURPLE, fontWeight: 600, textDecoration: "none" }}>
                Ver termos para Empresas →
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
                desenvolvido especificamente para o mercado brasileiro. Nossa plataforma conecta criadores de soluções de IA
                — agentes, automações, chatbots, prompts e integrações — com empresas que precisam adotar IA em seus negócios.
              </P>
              <P>
                A WePrompt funciona como intermediária: facilitamos a descoberta, a transação e a entrega das soluções,
                garantindo qualidade por meio de curadoria editorial, e processando os pagamentos com segurança entre
                compradores e criadores.
              </P>
              <P>
                Ao se cadastrar como criador na WePrompt, você concorda em seguir estes termos integralmente.
              </P>
            </Section>

            <div style={{ height: 1, background: BORDER, marginBottom: 48 }} />

            <Section number="2" title="Como funciona para Criadores">
              <P>O processo de publicação e venda na WePrompt segue estas etapas:</P>
              <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 16 }}>
                {[
                  { step: "1", title: "Cadastro", desc: "Crie sua conta gratuita na WePrompt selecionando o perfil \"Criador\". Seu perfil fica disponível para personalização imediatamente." },
                  { step: "2", title: "Publicação da solução", desc: "Envie sua solução com título, descrição detalhada, categoria, preço, imagem de capa e os materiais de entrega (arquivos, links de acesso ou instruções)." },
                  { step: "3", title: "Curadoria e aprovação", desc: "Nossa equipe analisa cada solução enviada antes de publicá-la. O processo leva até 48 horas úteis. Você recebe um retorno por e-mail com aprovação ou motivo de reprovação." },
                  { step: "4", title: "Publicação e vendas", desc: "Após aprovada, sua solução aparece no catálogo público da WePrompt, ficando disponível para empresas comprarem ou assinarem." },
                  { step: "5", title: "Recebimento", desc: "Cada venda ou assinatura confirmada gera um crédito na sua conta WePrompt. O repasse ocorre via PIX em até 30 dias após a confirmação." },
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

            <Section number="3" title="Planos disponíveis para Criadores">
              <P>A WePrompt oferece três planos para criadores:</P>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
                {[
                  {
                    name: "Free — Gratuito",
                    color: GRAY,
                    bg: "#fafafa",
                    border: BORDER,
                    items: [
                      "Até 3 soluções publicadas simultaneamente",
                      "20% de comissão sobre cada venda",
                      "Analytics básico (visualizações e vendas)",
                      "Suporte via e-mail padrão",
                      "Badge de criador no perfil",
                    ],
                  },
                  {
                    name: "Pro — R$ 97/mês (ou R$ 77/mês no anual)",
                    color: PURPLE,
                    bg: "rgba(107,92,231,0.04)",
                    border: "rgba(107,92,231,0.15)",
                    items: [
                      "Soluções ilimitadas",
                      "15% de comissão sobre cada venda",
                      "Destaque na página da categoria",
                      'Badge "Criador Verificado" ✦',
                      "Analytics completo com métricas de conversão",
                      "Suporte prioritário",
                    ],
                  },
                  {
                    name: "Premium — R$ 297/mês (ou R$ 237/mês no anual)",
                    color: DARK,
                    bg: "rgba(10,10,26,0.03)",
                    border: "rgba(0,0,0,0.1)",
                    items: [
                      "Tudo do plano Pro",
                      "10% de comissão sobre cada venda",
                      "Posição de topo dentro da categoria",
                      "Destaque na homepage da WePrompt",
                      "Suporte prioritário dedicado",
                      "Acesso a ferramentas de gestão de afiliados",
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
                Os valores acima são cobrados mensalmente ou anualmente conforme o plano escolhido.
                O plano anual oferece 20% de desconto. Para mais detalhes, visite a nossa{" "}
                <a href="/precos" style={{ color: PURPLE, fontWeight: 600, textDecoration: "none" }}>página de preços</a>.
              </P>
            </Section>

            <div style={{ height: 1, background: BORDER, marginBottom: 48 }} />

            <Section number="4" title="Comissão da plataforma">
              <P>
                A WePrompt retém uma comissão sobre cada venda ou assinatura realizada pelo seu cliente.
                O valor da comissão depende do seu plano ativo no momento da venda:
              </P>
              <div style={{
                background: "#fafafa", border: `1px solid ${BORDER}`, borderRadius: 12, overflow: "hidden", marginBottom: 16,
              }}>
                {[
                  { plano: "Free", comissao: "20%", ex: "R$ 100 vendido → R$ 80,00 para você" },
                  { plano: "Pro", comissao: "15%", ex: "R$ 100 vendido → R$ 85,00 para você" },
                  { plano: "Premium", comissao: "10%", ex: "R$ 100 vendido → R$ 90,00 para você" },
                ].map((row, i) => (
                  <div key={row.plano} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "14px 20px", borderTop: i > 0 ? `1px solid ${BORDER}` : "none",
                    flexWrap: "wrap", gap: 8,
                  }}>
                    <span style={{ fontWeight: 700, color: DARK, fontSize: 14 }}>Plano {row.plano}</span>
                    <span style={{ fontSize: 22, fontWeight: 800, color: PURPLE }}>{row.comissao}</span>
                    <span style={{ fontSize: 13, color: GRAY, flex: "1 1 100%" }}>{row.ex}</span>
                  </div>
                ))}
              </div>
              <P>
                A comissão é calculada sobre o valor bruto da transação, antes de qualquer desconto de plano da empresa
                compradora. A WePrompt se reserva o direito de ajustar as taxas de comissão mediante aviso prévio de 30 dias.
              </P>
              <InfoBox
                color="#B45309"
                bg="rgba(245,158,11,0.06)"
                border="rgba(245,158,11,0.2)"
                title="Importante"
              >
                Em caso de downgrade de plano, a taxa de comissão das novas vendas será a correspondente ao plano atual.
                Vendas já realizadas não são afetadas retroativamente.
              </InfoBox>
            </Section>

            <div style={{ height: 1, background: BORDER, marginBottom: 48 }} />

            <Section number="5" title="Como funciona o repasse">
              <P>
                Todo valor arrecadado com suas vendas é creditado na sua carteira WePrompt. O repasse segue estas regras:
              </P>
              <Ul items={[
                "Prazo de repasse: até 30 dias corridos após a confirmação do pagamento pelo comprador.",
                "Valor mínimo para saque: R$ 50,00. Saldos abaixo deste valor permanecem acumulados para o próximo ciclo.",
                "Meio de pagamento: exclusivamente via PIX. Você deve cadastrar e manter sua chave PIX atualizada nas configurações do seu perfil.",
                "Política de estorno: se uma venda for estornada (chargeback), o valor correspondente é deduzido do seu saldo disponível. Se o saldo for insuficiente, será descontado no próximo repasse.",
                "Comprovante: você recebe por e-mail um comprovante de cada repasse realizado.",
              ]} />
              <InfoBox
                color="#15803D"
                bg="rgba(22,163,74,0.06)"
                border="rgba(22,163,74,0.18)"
              >
                Dica: mantenha sempre sua chave PIX atualizada nas Configurações do seu painel para evitar atrasos no recebimento.
              </InfoBox>
            </Section>

            <div style={{ height: 1, background: BORDER, marginBottom: 48 }} />

            <Section number="6" title="Primeiros 3 meses gratuitos — Criadores Fundadores">
              <P>
                Como parte do programa de lançamento da WePrompt, os primeiros 500 criadores a se cadastrarem
                receberão <strong>3 meses gratuitos</strong> nos planos Pro e Premium. Esta é uma oferta exclusiva
                para criadores fundadores da plataforma.
              </P>
              <P>Condições da oferta:</P>
              <Ul items={[
                "Disponível apenas para os primeiros 500 criadores cadastrados na plataforma.",
                "Aplicável exclusivamente nos planos Pro e Premium.",
                "Os 3 meses gratuitos são concedidos no momento do upgrade para o plano pago.",
                "Não é necessário cartão de crédito durante os 3 meses gratuitos.",
                "Após o período gratuito, a cobrança começa automaticamente no plano escolhido. Você pode cancelar antes do fim do período sem custo.",
                "A WePrompt se reserva o direito de encerrar esta oferta a qualquer momento para novas adesões, sem afetar quem já ativou o benefício.",
              ]} />
            </Section>

            <div style={{ height: 1, background: BORDER, marginBottom: 48 }} />

            <Section number="7" title="Curadoria e aprovação de soluções">
              <P>
                A WePrompt avalia manualmente toda solução enviada antes de publicá-la no marketplace.
                Este processo é fundamental para garantir a qualidade do catálogo e proteger as empresas compradoras.
              </P>
              <P>Nossa equipe analisa os seguintes critérios:</P>
              <Ul items={[
                "A solução funciona conforme descrita? Testamos ou verificamos o que foi enviado.",
                "A descrição é clara, honesta e suficientemente detalhada?",
                "O material de entrega (arquivos, links, instruções) está completo e funcional?",
                "O preço está alinhado com o valor entregue?",
                "A solução atende às regras de conteúdo da plataforma?",
              ]} />
              <P>
                O prazo padrão de curadoria é de <strong>até 48 horas úteis</strong>. Você receberá um e-mail
                informando o resultado. Em caso de reprovação, o motivo será detalhado e você poderá fazer
                ajustes e reenviar para nova análise.
              </P>
              <InfoBox
                color={PURPLE}
                bg="rgba(107,92,231,0.05)"
                border="rgba(107,92,231,0.12)"
                title="Sobre atualizações de soluções aprovadas"
              >
                Se você realizar alterações significativas em uma solução já aprovada (mudança de preço superior a 50%,
                alteração do escopo, troca do material de entrega), a solução poderá ser submetida a nova curadoria
                antes de as mudanças entrarem em vigor.
              </InfoBox>
            </Section>

            <div style={{ height: 1, background: BORDER, marginBottom: 48 }} />

            <Section number="8" title="O que pode ser vendido na WePrompt">
              <P>
                A WePrompt é especializada em soluções de inteligência artificial prontas para uso.
                Os tipos de soluções aceitas incluem:
              </P>
              <Ul items={[
                "Agentes de IA: sistemas autônomos que executam tarefas específicas utilizando modelos de linguagem.",
                "Automações: fluxos de trabalho automatizados que integram IA com ferramentas como Zapier, Make, n8n, entre outros.",
                "Chatbots e assistentes: bots de atendimento, suporte ou consulta treinados para contextos específicos.",
                "Prompts e sistemas de prompts: conjuntos de instruções otimizadas para uso com modelos como GPT, Claude, Gemini.",
                "Integrações e APIs: conectores que integram IA a sistemas existentes (CRM, ERP, e-commerce).",
                "Kits e pacotes: conjuntos de soluções complementares vendidos em conjunto.",
              ]} />
              <P>
                Soluções em categorias não listadas acima podem ser aceitas a critério da equipe de curadoria.
                Entre em contato pelo e-mail{" "}
                <a href="mailto:contato@weprompt.app.br" style={{ color: PURPLE, fontWeight: 600, textDecoration: "none" }}>
                  contato@weprompt.app.br
                </a>{" "}
                para verificar elegibilidade.
              </P>
            </Section>

            <div style={{ height: 1, background: BORDER, marginBottom: 48 }} />

            <Section number="9" title="Proibições">
              <P>
                É estritamente proibido publicar ou tentar publicar na WePrompt qualquer solução ou conteúdo que:
              </P>
              <Ul items={[
                "Seja plagiado, copiado sem autorização ou que viole direitos de propriedade intelectual de terceiros.",
                "Faça promessas falsas ou enganosas sobre resultados, capacidades ou desempenho da solução.",
                "Não funcione conforme descrito na listagem ou esteja quebrado/incompleto no momento da venda.",
                "Contenha malware, spyware, código malicioso ou qualquer elemento que possa prejudicar sistemas de terceiros.",
                "Viole leis brasileiras ou internacionais, incluindo legislação de proteção de dados (LGPD), direitos autorais e normas de publicidade.",
                "Seja de natureza pornográfica, discriminatória, hateful ou que promova violência.",
                "Engane compradores sobre a identidade do criador, a origem da solução ou suas certificações.",
                "Utilize modelos de IA ou dados de treinamento que violem os termos de uso dos respectivos fornecedores.",
              ]} />
              <InfoBox
                color="#B91C1C"
                bg="rgba(220,38,38,0.05)"
                border="rgba(220,38,38,0.15)"
                title="Consequências"
              >
                Violações das proibições podem resultar em remoção imediata da solução, suspensão ou encerramento da conta,
                retenção de saldos pendentes e ação legal quando aplicável. A WePrompt coopera integralmente com autoridades
                em casos de atividade ilegal.
              </InfoBox>
            </Section>

            <div style={{ height: 1, background: BORDER, marginBottom: 48 }} />

            <Section number="10" title="Responsabilidades do Criador">
              <P>
                Como criador na WePrompt, você é responsável por:
              </P>
              <Ul items={[
                "Manter sua solução funcionando conforme descrita. Se a solução parar de funcionar, você deve corrigi-la o mais rápido possível ou comunicar a WePrompt.",
                "Responder a dúvidas e solicitações de suporte dos compradores da sua solução em até 5 dias úteis.",
                "Atualizar a solução quando houver mudanças nas ferramentas ou plataformas das quais ela depende (ex: atualizações de API, mudanças em plataformas de automação).",
                "Garantir que possui todos os direitos necessários para comercializar a solução na WePrompt.",
                "Manter seus dados cadastrais e chave PIX atualizados no painel.",
                "Informar imediatamente à WePrompt qualquer problema técnico que afete os compradores.",
                "Não solicitar avaliações falsas ou incentivos indevidos para receber reviews positivos.",
              ]} />
            </Section>

            <div style={{ height: 1, background: BORDER, marginBottom: 48 }} />

            <Section number="11" title="Responsabilidades da WePrompt">
              <P>A WePrompt se compromete a:</P>
              <Ul items={[
                "Processar pagamentos de forma segura e repassar os valores devidos dentro dos prazos estabelecidos.",
                "Manter a plataforma disponível e funcional, com meta de uptime de 99% ao mês.",
                "Realizar a curadoria de soluções de forma justa, com critérios claros e feedback construtivo.",
                "Proteger os dados dos criadores conforme a LGPD e nossa Política de Privacidade.",
                "Oferecer suporte técnico e comercial nos canais e prazos indicados no plano do criador.",
                "Comunicar antecipadamente qualquer alteração nos termos, nas comissões ou nas regras da plataforma.",
                "Remover imediatamente soluções que violem os termos após verificação.",
              ]} />
              <P>
                A WePrompt não se responsabiliza por resultados específicos obtidos pelas empresas compradoras
                ao usar as soluções, nem por perdas indiretas decorrentes do uso das soluções.
              </P>
            </Section>

            <div style={{ height: 1, background: BORDER, marginBottom: 48 }} />

            <Section number="12" title="Cancelamento e reembolso">
              <P>
                <strong>Cancelamento pelo criador:</strong> Você pode cancelar seu plano pago a qualquer momento
                pelo painel. O acesso às funcionalidades do plano permanece ativo até o fim do período já pago.
                Após o cancelamento, sua conta retorna ao plano Free.
              </P>
              <P>
                <strong>Cancelamento pela WePrompt:</strong> A WePrompt pode cancelar ou suspender sua conta
                em caso de violação dos termos, após notificação prévia (exceto em casos de atividade ilegal
                ou dano imediato à plataforma).
              </P>
              <P>
                <strong>Reembolso de mensalidades:</strong> Mensalidades pagas não são reembolsadas de forma
                proporcional em caso de cancelamento antecipado. A exceção é para casos de falha técnica
                comprovada da WePrompt que impeça o uso do plano pelo período integral.
              </P>
              <P>
                <strong>Saldo de vendas:</strong> Em caso de encerramento de conta, saldos acumulados acima
                de R$ 50 serão repassados na data normal de pagamento ou em até 30 dias após o encerramento.
              </P>
            </Section>

            <div style={{ height: 1, background: BORDER, marginBottom: 48 }} />

            <Section number="13" title="Disputas entre Criador e Empresa compradora">
              <P>
                Em caso de disputa entre um criador e uma empresa compradora (ex: solução não entregue,
                solução diferente do descrito, falha técnica), o processo é:
              </P>
              <Ul items={[
                "O comprador abre uma disputa no suporte da WePrompt apresentando evidências do problema.",
                "A WePrompt notifica o criador e concede um prazo de 5 dias úteis para resposta e solução.",
                "Se o criador corrigir o problema dentro do prazo, a disputa é encerrada.",
                "Se o problema não for resolvido, a WePrompt pode conceder reembolso ao comprador e descontar o valor do saldo do criador.",
                "Em casos graves ou recorrentes, a WePrompt pode suspender ou remover soluções do criador.",
              ]} />
              <P>
                A WePrompt atua como mediadora neutra nas disputas. Decisões da WePrompt em disputas são
                finais dentro da plataforma, mas não excluem o direito das partes de buscar resolução
                por vias legais externas.
              </P>
            </Section>

            <div style={{ height: 1, background: BORDER, marginBottom: 48 }} />

            <Section number="14" title="Alterações nestes Termos">
              <P>
                A WePrompt pode alterar estes Termos a qualquer momento. Em caso de alterações significativas
                (mudanças nas comissões, novas obrigações ou restrições), você será notificado por e-mail
                com pelo menos <strong>30 dias de antecedência</strong>.
              </P>
              <P>
                Alterações menores (correções gramaticais, esclarecimentos sem impacto nos direitos) podem
                ser feitas sem notificação prévia. A data de "Última atualização" no topo desta página
                sempre refletirá a versão vigente.
              </P>
              <P>
                O uso continuado da plataforma após a data de vigência das novas condições constitui
                aceitação das mesmas. Se você discordar, pode cancelar sua conta antes da data de vigência.
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
                Nossa equipe está pronta para esclarecer qualquer questão sobre sua conta,
                comissões, repasses ou regras da plataforma.
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
                <a href="/para-empresas/termos" style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  borderRadius: 999, padding: "11px 24px",
                  border: `1.5px solid ${BORDER}`, color: DARK,
                  fontSize: 14, fontWeight: 600, textDecoration: "none",
                  background: "transparent",
                }}>
                  Ver termos para Empresas
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
            <WePromptLogo id="termos-c-footer" textColor={DARK} />
          </a>
          <p style={{ fontSize: 13, color: GRAY, margin: 0 }}>
            © 2026 WePrompt. O 1º marketplace de IA da América Latina.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 20 }}>
            <a href="/para-criadores/termos" className="footer-link" style={{ color: PURPLE, fontWeight: 600 }}>Termos para Criadores</a>
            <a href="/para-empresas/termos" className="footer-link">Termos para Empresas</a>
            <a href="mailto:contato@weprompt.app.br" className="footer-link">Contato</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
