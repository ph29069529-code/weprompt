export default function WePromptLogo({ id, textColor = "#0A0A1A" }) {
  const gA = `wp-a-${id || "x"}`;
  const gB = `wp-b-${id || "x"}`;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", userSelect: "none" }}>
      <svg width="26" height="30" viewBox="0 0 28 32" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id={gA} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#67E8F9" />
            <stop offset="100%" stopColor="#38BDF8" />
          </linearGradient>
          <linearGradient id={gB} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#1D6FE8" />
          </linearGradient>
        </defs>
        <rect x="6" y="2" width="17" height="22" rx="3"
          fill={`url(#${gA})`} transform="skewX(-12)" />
        <rect x="1" y="20" width="10" height="10" rx="2"
          fill={`url(#${gB})`} />
      </svg>
      <span style={{ color: textColor, fontWeight: 600, fontSize: "18px", letterSpacing: "-0.2px", lineHeight: 1 }}>
        WePrompt
      </span>
    </div>
  );
}
