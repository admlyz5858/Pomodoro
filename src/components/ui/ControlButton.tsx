interface ControlButtonProps {
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  children: React.ReactNode;
  ariaLabel: string;
}

const baseClasses =
  'inline-flex items-center justify-center rounded-full font-medium transition-all duration-200 cursor-pointer select-none active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring';

const variants = {
  primary:
    'bg-accent text-white hover:bg-accent-glow shadow-lg shadow-accent/25 hover:shadow-accent/40',
  secondary:
    'bg-surface-light text-text-primary hover:bg-surface-light/80 border border-white/5',
  ghost:
    'bg-transparent text-text-secondary hover:text-text-primary hover:bg-surface-light/50',
} as const;

const sizes = {
  sm: 'h-10 w-10 text-sm',
  md: 'h-12 px-6 text-sm',
  lg: 'h-14 px-8 text-base',
} as const;

export function ControlButton({
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  children,
  ariaLabel,
}: ControlButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]}`}
    >
      {children}
    </button>
  );
}
