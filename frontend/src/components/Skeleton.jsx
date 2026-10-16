export function Skeleton({ className = '', ...props }) {
  return <div {...props} aria-hidden="true" className={`h-4 rounded-lg bg-slate-200 motion-safe:animate-pulse ${className}`} />;
}
