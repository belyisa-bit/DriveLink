import jeepCompass from '../../assets/jeep-compass-hero.webp';

export function CatalogHero() {
  return (
    <section aria-labelledby="catalog-title" className="relative isolate overflow-hidden">
      <div className="mx-auto grid max-w-7xl items-center gap-5 px-5 pb-10 pt-10 sm:px-8 sm:pt-12 lg:grid-cols-2 lg:px-10 lg:pb-12">
        <div className="relative z-10 max-w-xl">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-brand-hover">Nosso estoque</p>
          <h1 id="catalog-title" className="text-4xl font-extrabold leading-[1.1] tracking-[-0.045em] text-slate-950 sm:text-5xl lg:text-6xl">Encontre o carro<br />ideal <span className="text-brand">para você.</span></h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-slate-600 sm:text-lg">Veículos selecionados, com procedência e um atendimento que te leva mais longe.</p>
        </div>
        <div className="relative min-w-0 lg:-mr-16">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <span className="absolute left-[8%] top-[10%] aspect-square w-[40%] rounded-full bg-amber-400" />
            <span className="absolute -right-[8%] -top-[5%] aspect-square w-[65%] rounded-full bg-gradient-to-br from-brand to-orange-500" />
            <span className="absolute -right-[20%] -top-[30%] aspect-square w-[85%] rounded-full border border-orange-400" />
          </div>
          <img src={jeepCompass} alt="Jeep Compass cinza" width="1400" height="788" decoding="async" className="relative block h-auto w-full drop-shadow-lg" />
        </div>
      </div>
    </section>
  );
}
