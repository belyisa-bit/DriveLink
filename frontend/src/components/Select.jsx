import { forwardRef, useId } from 'react';
import { ChevronDown } from 'lucide-react';
import { FormField } from './FormField';
import { fieldClasses, fieldDescription } from '../lib/formField';

export const Select = forwardRef(function Select(
  { id, label, error, hint, required = false, className = '', wrapperClassName = '', children, 'aria-describedby': describedBy, ...props },
  ref,
) {
  const generatedId = useId();
  const fieldId = id || generatedId;

  return (
    <FormField id={fieldId} label={label} required={required} error={error} hint={hint} className={wrapperClassName}>
      <div className="relative">
        <select {...props} ref={ref} id={fieldId} required={required} aria-invalid={error ? true : props['aria-invalid']} aria-describedby={fieldDescription(fieldId, hint, error, describedBy)} className={fieldClasses(error, `appearance-none pr-11 ${className}`)}>
          {children}
        </select>
        <ChevronDown size={18} aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500" />
      </div>
    </FormField>
  );
});
