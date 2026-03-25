interface SoftInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
  min?: string;
  step?: string;
}

export function SoftInput({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  placeholder,
  min,
  step,
}: SoftInputProps) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-muted">
        {label}
        {required && <span className="text-foreground/30 ml-0.5">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        min={min}
        step={step}
        className="w-full rounded-lg border border-black/[0.06] bg-white/60 px-3.5 py-2.5 text-sm text-foreground placeholder:text-foreground/25 focus:bg-white focus:border-foreground/20 focus:outline-none focus:ring-1 focus:ring-foreground/10 transition-all duration-200"
      />
    </div>
  );
}
