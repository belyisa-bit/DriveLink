import { forwardRef, useId } from 'react';
import { FormField } from './FormField';
import { fieldClasses, fieldDescription } from '../lib/formField';

export const Input = forwardRef(function Input(
  { id, label, error, hint, required = false, type = 'text', className = '', wrapperClassName = '', 'aria-describedby': describedBy, ...props },
  ref,
) {
  const generatedId = useId();
  const fieldId = id || generatedId;

  return (
    <FormField id={fieldId} label={label} required={required} error={error} hint={hint} className={wrapperClassName}>
      <input {...props} ref={ref} id={fieldId} type={type} required={required} aria-invalid={error ? true : props['aria-invalid']} aria-describedby={fieldDescription(fieldId, hint, error, describedBy)} className={fieldClasses(error, className)} />
    </FormField>
  );
});
