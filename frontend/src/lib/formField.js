export function fieldDescription(id, hint, error, describedBy) {
  return [describedBy, hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ') || undefined;
}

export function fieldClasses(error, className = '') {
  return `min-h-12 w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500 ${error ? 'border-red-700' : 'border-slate-300'} ${className}`;
}
