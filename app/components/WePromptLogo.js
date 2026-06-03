export default function WePromptLogo({ id, dark }) {
  return (
    <img
      id={id}
      src={dark ? "/logo-white.png" : "/logo.png"}
      alt="WePrompt"
      style={{ height: 32, width: "auto", maxWidth: 160, objectFit: "contain", display: "block" }}
    />
  );
}
