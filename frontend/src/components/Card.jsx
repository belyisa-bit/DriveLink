export function Card({ as: Component = 'div', className = '', children, ...props }) {
  return (
    <Component {...props} className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}>
      {children}
    </Component>
  );
}
