export default function WePromptLogo({ id, dark }) {
  return (
    <img
      id={id}
      src={dark ? "/logo-dark.png" : "/logo-light.png"}
      alt="WePrompt"
      style={{ height: 36, width: "auto", display: "block", maxWidth: "none", objectFit: "contain" }}
    />
  );
}
