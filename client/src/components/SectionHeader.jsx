export default function SectionHeader({ eyebrow, title, description, align = "left" }) {
  return (
    <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      {eyebrow && <p className="mb-2 text-sm font-black uppercase tracking-wide text-saffron-600">{eyebrow}</p>}
      <h2 className="text-3xl font-black text-shiva-900 sm:text-4xl">{title}</h2>
      {description && <p className="mt-3 text-base leading-7 text-slate-600">{description}</p>}
    </div>
  );
}
