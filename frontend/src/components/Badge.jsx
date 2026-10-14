const variants = {
  neutral: 'bg-slate-100 text-slate-700',
  brand: 'bg-brand-light text-brand-hover',
  success: 'bg-emerald-50 text-emerald-800',
  warning: 'bg-amber-100 text-amber-900',
};

export function Badge({ variant = 'neutral', className = '', children, ...props }) {
  return <span {...props} className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${variants[variant] || variants.neutral} ${className}`}>{children}</span>;
}
