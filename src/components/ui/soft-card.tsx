interface SoftCardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function SoftCard({
  title,
  children,
  className = "",
}: SoftCardProps) {
  return (
    <section
      className={`rounded-2xl bg-white/80 backdrop-blur-xl shadow-card ${className}`}
    >
      {title && (
        <div className="px-6 pt-5 pb-1">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted">
            {title}
          </h2>
        </div>
      )}
      <div className="px-6 pb-6 pt-3 space-y-4">{children}</div>
    </section>
  );
}
