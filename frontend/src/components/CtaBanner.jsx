import { ArrowRight } from 'lucide-react';
import { Button } from './Button';

export function CtaBanner({
  eyebrow = 'Vamos juntos?',
  title = 'Encontre o carro ideal para a sua',
  highlight = 'próxima fase.',
  buttonLabel = 'Quero atendimento',
  to = '/atendimento',
  className = '',
}) {
  return (
    <section aria-label="Convite para atendimento" className={`relative isolate overflow-hidden rounded-2xl bg-gradient-to-r from-brand to-orange-600 px-6 py-6 sm:px-8 sm:py-7 ${className}`}>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <span className="absolute -bottom-28 left-1/2 h-56 w-56 rounded-full bg-amber-400" />
        <span className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-amber-400" />
        <span className="absolute -right-16 -top-32 h-96 w-96 rounded-full border border-amber-300/70" />
      </div>

      <div className="flex flex-col items-start gap-5 md:flex-row md:items-center md:justify-between md:gap-8">
        <div className="max-w-xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-white">{eyebrow}</p>
          <h2 className="text-2xl font-extrabold leading-tight tracking-tight text-white sm:text-3xl">
            {title}{highlight && <> <span className="text-amber-200">{highlight}</span></>}
          </h2>
        </div>
        <Button to={to} variant="inverse" className="w-full shrink-0 focus-visible:outline-white sm:w-auto">
          {buttonLabel} <ArrowRight size={18} aria-hidden="true" />
        </Button>
      </div>
    </section>
  );
}
