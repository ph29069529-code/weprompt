# Mobile-First — Regras de Responsividade

## Regra crítica: sem isMobile useState

NUNCA fazer isso:
```js
const [isMobile, setIsMobile] = useState(window.innerWidth < 768) // ERRADO — hydration mismatch
```

SEMPRE usar media queries no JSX:
```js
<style>{`
  .meu-grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
  @media (min-width: 768px) { .meu-grid { grid-template-columns: repeat(3, 1fr); } }
`}</style>
```

Exceção permitida: `useWindowSize` hook com valor inicial seguro (`1200`) para lógica de layout JS-only que não afeta o HTML inicial.

## Tap targets
- Todos elementos clicáveis: mínimo `44px × 44px`
- Botões: `minHeight: 44`, `padding` adequado
- Links de navegação: padding vertical mínimo 12px
- Ícones clicáveis: `width: 44, height: 44` ou wrapper com padding

## Tipografia mobile
- Fonte mínima body: `14px` — NUNCA abaixo disso
- Fonte mínima labels/hints: `12px`
- Headings em mobile: reduzir (ex: 36px → 22px)

## Layout
- `maxWidth: 1200, margin: "0 auto"` nos containers principais
- `padding: "0 16px"` mobile, `"0 48px"` desktop no mesmo container via media query
- Sem `width` ou `minWidth` fixo que cause overflow horizontal
- Scroll horizontal permitido apenas em tabelas (com wrapper `overflowX: "auto"`)
- `boxSizing: "border-box"` em todos inputs e elementos com padding + width 100%

## Grids responsivos
- Mobile: sempre `grid-template-columns: 1fr`
- Tablet 640px: `repeat(2, 1fr)` ou `repeat(auto-fill, minmax(280px, 1fr))`
- Desktop 768px+: colunas fixas conforme o design
- Flex wrap: `flexWrap: "wrap"` em rows que precisam quebrar

## Inputs e formulários
- `width: "100%"`, `boxSizing: "border-box"`
- `minHeight: 44` em inputs e selects
- `fontSize: 16px` em iOS para evitar zoom automático no focus

## Imagens
- `loading="lazy"` para imagens abaixo do fold
- `objectFit: "cover"` em imagens de dimensão fixa
- `maxWidth: "100%"` em imagens dentro de containers fluidos

## Testes obrigatórios
- 390px (iPhone SE / iPhone 14 width)
- 768px (tablet / iPad mini)
- 1200px (desktop padrão)
- Verificar overflow horizontal em cada breakpoint
- Verificar que tap targets são atingíveis com polegar em 390px
