type MarketingPageHeaderProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
};

/** Shortlisted marketing pages — diagonal soft band, single accent bar (not Lakshya grid + rainbow) */
export function MarketingPageHeader({ eyebrow, title, subtitle }: MarketingPageHeaderProps) {
  return (
    <section className="relative overflow-hidden border-b border-line-default">
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-blue/[0.05] via-white to-brand-orange/[0.06]"
        aria-hidden
      />
      <div className="page-container relative py-14 sm:py-20">
        <p className="section-eyebrow">{eyebrow}</p>
        <h1 className="mt-3 max-w-3xl font-display text-3xl font-extrabold leading-tight text-ink-primary sm:text-5xl">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-ink-muted">{subtitle}</p>
      </div>
      <div className="h-1 w-full bg-gradient-to-r from-brand-blue via-brand-sky to-brand-orange" aria-hidden />
    </section>
  );
}
