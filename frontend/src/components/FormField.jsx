export function FormField({ id, label, required, error, hint, children, className = '' }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && <label htmlFor={id} className="block text-sm font-medium text-slate-900">{label}{required && <span aria-hidden="true" className="ml-1 text-brand">*</span>}</label>}
      {children}
      {hint && <p id={`${id}-hint`} className="text-sm text-slate-600">{hint}</p>}
      {error && <p id={`${id}-error`} className="text-sm font-medium text-red-700">{error}</p>}
    </div>
  );
}
