import Link from "next/link";

type Variant = "primary" | "secondary" | "ghost";

interface SoftButtonProps {
  children: React.ReactNode;
  href?: string;
  variant?: Variant;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  target?: string;
  rel?: string;
  fullWidth?: boolean;
  size?: "sm" | "md" | "lg";
}

const variants: Record<Variant, string> = {
  primary:
    "bg-black text-white hover:bg-black/90 active:scale-[0.98]",
  secondary:
    "bg-white/80 backdrop-blur text-foreground border border-black/[0.06] hover:bg-white active:scale-[0.98]",
  ghost:
    "text-muted hover:text-foreground",
};

const sizes: Record<string, string> = {
  sm: "px-4 py-2 text-sm rounded-xl",
  md: "px-5 py-2.5 text-sm rounded-xl",
  lg: "px-6 py-3 text-[15px] rounded-xl",
};

export function SoftButton({
  children,
  href,
  variant = "primary",
  type = "button",
  disabled = false,
  onClick,
  className = "",
  target,
  rel,
  fullWidth = false,
  size = "md",
}: SoftButtonProps) {
  const base = `inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
    fullWidth ? "w-full" : ""
  } ${sizes[size]} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={base} target={target} rel={rel}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={base}
    >
      {children}
    </button>
  );
}
