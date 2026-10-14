import { forwardRef } from 'react';
import { Link } from 'react-router-dom';

const variants = {
  primary: 'border-brand bg-brand text-white hover:border-brand-hover hover:bg-brand-hover',
  outline: 'border-brand bg-transparent text-brand hover:bg-brand-light',
  inverse: 'border-white bg-white text-brand hover:border-brand-light hover:bg-brand-light',
};

export const Button = forwardRef(function Button(
  { to, variant = 'primary', className = '', type = 'button', disabled = false, children, ...props },
  ref,
) {
  const classes = `inline-flex min-h-12 items-center justify-center gap-3 rounded-xl border px-6 py-3 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant] || variants.primary} ${className}`;

  if (to && !disabled) {
    return <Link ref={ref} to={to} className={classes} {...props}>{children}</Link>;
  }

  return <button ref={ref} type={type} disabled={disabled} className={classes} {...props}>{children}</button>;
});
