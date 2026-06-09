# WePrompt Design System

## Cores
- Primária: `#6366F1` (índigo) — botões CTA, links ativos, badges
- Escura: `#0A0F1E` — botões primários, textos de destaque
- Secundária: `#F8F9FB` — fundo de páginas e dashboards
- Texto secundário: `#6B7280`
- Border padrão: `#E5E7EB`
- Border accent: `rgba(99,102,241,0.25)`
- Sucesso: `#16A34A` / fundo `#F0FDF4`
- Erro: `#DC2626` / fundo `rgba(239,68,68,0.06)`
- Aviso: `#D97706` / fundo `#FEF3C7`

## Tipografia
- Família: Inter, -apple-system, BlinkMacSystemFont, sans-serif
- Headings: `fontWeight: 800`, `letterSpacing: "-0.03em"`
- Labels e caps: `fontSize: 12-13px`, `fontWeight: 700`, `letterSpacing: 1`, `textTransform: "uppercase"`, `color: "#9CA3AF"`
- Body: `fontSize: 14px`, `lineHeight: 1.6`
- Código / prompts: `fontFamily: "'Fira Code', 'Courier New', monospace"`

## Botões
- Primário escuro: `background: "#0A0F1E"`, `color: "white"`, `borderRadius: 10`, `minHeight: 44`
- Primário índigo: `background: "#6366F1"`, `color: "white"`, `borderRadius: 10`, `minHeight: 44`
- Secundário: `border: "1px solid #E5E7EB"`, `background: "white"`, `borderRadius: 10`, `minHeight: 44`
- Hover escuro: `"#374151"`
- Hover índigo: `"#4F46E5"`
- Disabled: `opacity: 0.5` ou background diluído

## Cards
- `background: "white"`, `borderRadius: 12`, `border: "1px solid #E5E7EB"`
- Box shadow sutil: `"0 2px 8px rgba(0,0,0,0.05)"`
- Box shadow hover: `"0 8px 24px rgba(0,0,0,0.08)"`
- Padding interno: `24px` (desktop), `16px` (mobile)

## Badges
- Padrão: `background: "#EEF2FF"`, `color: "#4F46E5"`, `borderRadius: 99`, `padding: "3px 10px"`, `fontSize: 11`, `fontWeight: 700`
- Verde: `background: "#F0FDF4"`, `color: "#16A34A"`
- Vermelho: `background: "rgba(220,38,38,0.1)"`, `color: "#DC2626"`
- Amarelo: `background: "rgba(217,119,6,0.1)"`, `color: "#B45309"`
- Roxo (agente_integracao): `background: "#EDE9FE"`, `color: "#6D28D9"`

## Inputs
- Border: `"1px solid #D1D5DB"`
- Focus border: `"#6366F1"` + `boxShadow: "0 0 0 3px rgba(99,102,241,0.1)"`
- `borderRadius: 8`, `padding: "10px 14px"`, `fontSize: 14`, `minHeight: 44`
- `outline: "none"`, `boxSizing: "border-box"`, `fontFamily: "inherit"`

## Regras absolutas
- NUNCA usar Tailwind CSS
- NUNCA usar framer-motion
- NUNCA usar classes CSS externas
- SEMPRE inline styles
- SEMPRE CSS media queries via bloco `<style>` no JSX
- Logo e identidade visual: NUNCA modificar sem instrução explícita
- Badge oficial WePrompt: `creator_id === "00000000-0000-0000-0000-000000000001"`
