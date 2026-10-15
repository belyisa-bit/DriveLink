import { ArrowRight } from 'lucide-react';
import { Button } from '../../components/Button';
import jeepCompass from '../../assets/vehicles/jeep-compass-hero.webp';

export function Hero() {
  return (
    <section aria-labelledby="home-hero-title" className="relative isolate overflow-hidden">
      <div className="mx-auto grid max-w-7xl items-center gap-4 px-5 pb-8 pt-10 sm:px-8 sm:pt-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-0 lg:px-10 lg:pb-12 lg:pt-16">
        <div className="relative z-10 max-w-xl">
          <p className="mb-5 text-xs font-semibold uppercase leading-6 tracking-[0.25em] text-brand-hover sm:text-sm">
            Mais que carros,<br /><span className="font-extrabold">novos caminhos.</span>
          </p>
          <h1 id="home-hero-title" className="text-4xl font-extrabold leading-[1.08] tracking-[-0.045em] text-slate-950 sm:text-5xl lg:text-6xl xl:text-7xl">
            Seu próximo<br /><span className="text-brand">carro</span> está<br />mais perto.
          </h1>
          <p className="mt-5 max-w-sm text-base leading-relaxed text-slate-600 sm:text-lg">
            Na Drivelink você encontra veículos selecionados, com procedência e um atendimento que te leva mais longe.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button to="/estoque">Ver catálogo <ArrowRight size={18} aria-hidden="true" /></Button>
            <Button to="/atendimento" variant="outline">Fazer pré-cadastro</Button>
          </div>
        </div>

        <div className="relative mt-5 min-w-0 lg:mt-0 lg:-ml-16 lg:-mr-20">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <span className="absolute left-[12%] top-[8%] aspect-square w-[45%] rounded-full bg-amber-400" />
            <span className="absolute -right-[8%] -top-[5%] aspect-square w-[65%] rounded-full bg-gradient-to-br from-brand to-orange-500" />
            <span className="absolute -right-[22%] -top-[30%] aspect-square w-[85%] rounded-full border border-orange-400" />
          </div>
          <img src={jeepCompass} alt="Jeep Compass cinza visto de frente e de lado" width="1400" height="788" fetchPriority="high" decoding="async" className="relative z-10 block h-auto w-full drop-shadow-xl" />
        </div>
      </div>
    </section>
  );
}
