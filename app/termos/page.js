"use client";

import { useState, useEffect } from "react";

const H = "#0A0F1E";
const B = "#374151";
const G = "#6B7280";
const INDIGO = "#6366F1";

export default function Termos() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const fn = () => setMobile(window.innerWidth < 640);
    fn();
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  const h2 = { fontSize: 20, fontWeight: 700, color: H, marginTop: 40, marginBottom: 12 };
  const p = { fontSize: 16, color: B, lineHeight: 1.8, margin: "0 0 16px" };
  const li = { marginBottom: 8 };

  const footerLinks = [["Início", "/"], ["Termos", "/termos"], ["Privacidade", "/privacidade"], ["Contato", "mailto:contato@weprompt.app.br"]];

  return (
    <div style={{ background: "#fff", minHeight: "100vh", fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif" }}>
      <main style={{ paddingTop: 64 }}>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: mobile ? "40px 24px 60px" : "80px 24px" }}>

          <p style={{ fontSize: 13, fontWeight: 700, color: INDIGO, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>
            Legal
          </p>
          <h1 style={{ fontSize: mobile ? 30 : 38, fontWeight: 800, color: H, letterSpacing: "-0.5px", margin: "0 0 10px" }}>
            Termos de Uso
          </h1>
          <p style={{ fontSize: 15, color: G, margin: "0 0 56px" }}>Última atualização: Junho de 2026</p>

          <h2 style={h2}>1. Aceitação dos termos</h2>
          <p style={p}>
            Ao acessar ou utilizar a plataforma WePrompt, você concorda com estes Termos de Uso. Se você não
            concordar com qualquer parte destes termos, não utilize a plataforma. Estes Termos constituem um
            acordo vinculante entre você e a WePrompt.
          </p>

          <h2 style={h2}>2. Descrição do serviço</h2>
          <p style={p}>
            A <strong>WePrompt</strong> é o primeiro marketplace de soluções de Inteligência Artificial da América
            Latina. A plataforma conecta criadores de soluções de IA (agentes, automações, chatbots, prompts e
            ferramentas) com empresas que buscam implementar IA em seus processos.
          </p>
          <p style={p}>
            A WePrompt atua como intermediária entre criadores e compradores, realizando a curadoria das soluções
            publicadas e processando os pagamentos. Reservamo-nos o direito de modificar, suspender ou encerrar
            qualquer funcionalidade da plataforma a qualquer momento.
          </p>

          <h2 style={h2}>3. Cadastro e conta</h2>
          <p style={p}>
            Para utilizar a WePrompt, você deve criar uma conta fornecendo informações verdadeiras e atualizadas.
            Você é responsável por manter a confidencialidade de suas credenciais de acesso e por todas as
            atividades realizadas em sua conta.
          </p>
          <ul style={{ fontSize: 16, color: B, lineHeight: 1.8, paddingLeft: 24, margin: "0 0 16px" }}>
            <li style={li}>Você deve ter 18 anos ou mais para se cadastrar na plataforma.</li>
            <li style={li}>Cada usuário pode ter apenas uma conta ativa.</li>
            <li style={li}>É proibido criar contas em nome de terceiros sem autorização.</li>
            <li style={li}>Notifique-nos imediatamente em caso de uso não autorizado da sua conta.</li>
          </ul>

          <h2 style={h2}>4. Para criadores</h2>
          <p style={p}>
            Ao publicar soluções na WePrompt, o criador concorda que:
          </p>
          <ul style={{ fontSize: 16, color: B, lineHeight: 1.8, paddingLeft: 24, margin: "0 0 16px" }}>
            <li style={li}>A solução publicada é original ou o criador possui os direitos necessários para comercializá-la.</li>
            <li style={li}>Toda solução passa pelo processo de curadoria da WePrompt antes de ser publicada no catálogo.</li>
            <li style={li}>Os pagamentos são realizados via PIX, conforme o calendário de repasses da plataforma.</li>
            <li style={li}>A WePrompt retém uma comissão sobre cada venda, conforme o plano contratado pelo criador.</li>
            <li style={li}>O criador é responsável por fornecer suporte básico aos compradores de sua solução.</li>
          </ul>

          <h2 style={h2}>5. Para empresas</h2>
          <p style={p}>
            Ao adquirir soluções na WePrompt, a empresa concorda que:
          </p>
          <ul style={{ fontSize: 16, color: B, lineHeight: 1.8, paddingLeft: 24, margin: "0 0 16px" }}>
            <li style={li}>O uso das soluções adquiridas é restrito ao uso interno da empresa e conforme descrito pelo criador.</li>
            <li style={li}>É proibido revender, sublicenciar ou redistribuir soluções adquiridas sem autorização.</li>
            <li style={li}>A empresa é responsável pela implementação e uso adequado das soluções em seu ambiente.</li>
            <li style={li}>A WePrompt não garante resultados específicos pelo uso das soluções.</li>
          </ul>

          <h2 style={h2}>6. Pagamentos e reembolsos</h2>
          <p style={p}>
            Todos os pagamentos na plataforma são processados pelo Stripe, um processador de pagamentos certificado
            PCI-DSS. Aceitamos cartão de crédito e débito, e PIX para pagamentos à vista.
          </p>
          <p style={p}>
            <strong>Política de reembolso:</strong> Oferecemos garantia de 7 dias a partir da data da compra. Se a
            solução não funcionar conforme descrito, você pode solicitar o reembolso integral enviando um e-mail
            para{" "}
            <a href="mailto:contato@weprompt.app.br" style={{ color: INDIGO, textDecoration: "none", fontWeight: 600 }}>
              contato@weprompt.app.br
            </a>{" "}
            dentro deste prazo. Após 7 dias, não são aceitos pedidos de reembolso.
          </p>

          <h2 style={h2}>7. Propriedade intelectual</h2>
          <p style={p}>
            Todo o conteúdo da plataforma WePrompt — incluindo logotipos, design, código-fonte da plataforma e
            materiais de marketing — é propriedade exclusiva da WePrompt e protegido pelas leis de propriedade
            intelectual brasileiras e internacionais.
          </p>
          <p style={p}>
            As soluções publicadas pelos criadores permanecem propriedade intelectual de seus respectivos autores.
            Ao publicar na WePrompt, o criador concede à plataforma uma licença não exclusiva para exibir, promover
            e comercializar a solução.
          </p>

          <h2 style={h2}>8. Limitação de responsabilidade</h2>
          <p style={p}>
            A WePrompt atua como intermediária e não se responsabiliza por:
          </p>
          <ul style={{ fontSize: 16, color: B, lineHeight: 1.8, paddingLeft: 24, margin: "0 0 16px" }}>
            <li style={li}>Resultados obtidos com o uso das soluções adquiridas</li>
            <li style={li}>Danos diretos ou indiretos decorrentes do uso ou impossibilidade de uso da plataforma</li>
            <li style={li}>Conteúdo publicado por criadores terceiros</li>
            <li style={li}>Falhas de serviços de terceiros integrados à plataforma (Stripe, Supabase, etc.)</li>
          </ul>
          <p style={p}>
            A responsabilidade total da WePrompt, em qualquer circunstância, é limitada ao valor pago pelo usuário
            nos 12 meses anteriores ao evento que gerou o dano.
          </p>

          <h2 style={h2}>9. Contato</h2>
          <p style={p}>
            Dúvidas sobre estes Termos de Uso podem ser enviadas para:{" "}
            <a href="mailto:contato@weprompt.app.br" style={{ color: INDIGO, textDecoration: "none", fontWeight: 600 }}>
              contato@weprompt.app.br
            </a>
          </p>
          <p style={{ ...p, marginBottom: 0 }}>
            Estes termos são regidos pela legislação brasileira. Fica eleito o foro da Comarca de São Paulo — SP
            para dirimir quaisquer controvérsias decorrentes deste instrumento.
          </p>

        </div>
      </main>

      <footer style={{ background: H, padding: "36px 24px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 14, margin: 0 }}>
            © 2026 WePrompt — O 1º marketplace de IA da América Latina
          </p>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            {footerLinks.map(([label, href]) => (
              <a key={label} href={href} style={{ color: "rgba(255,255,255,0.45)", fontSize: 14, textDecoration: "none", transition: "color 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.color = "#fff"}
                onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.45)"}>
                {label}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
