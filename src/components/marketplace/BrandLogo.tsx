export function BrandLogo({
  name,
  accent = "#176b54",
  size = "normal",
}: {
  name: string;
  accent?: string;
  size?: "normal" | "small";
}) {
  return (
    <span
      className={`brand-logo brand-logo-${size}`}
      style={{ background: `linear-gradient(135deg, ${accent}, #18372d)` }}
      aria-label={`${name} logo`}
      title={name}
    >
      {name.slice(0, 2).toUpperCase()}
    </span>
  );
}
