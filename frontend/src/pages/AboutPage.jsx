import { ArrowRight, CarFront, Search, ShieldCheck } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

const benefits = [
  {
    icon: Search,
    title: 'Busca simplificada',
    description: 'Encontre veículos e explore as opções disponíveis em nosso catálogo.',
  },
  {
    icon: ShieldCheck,
    title: 'Informações organizadas',
    description: 'Consulte detalhes dos veículos para tomar decisões com mais confiança.',
  },
  {
    icon: CarFront,
    title: 'Atendimento facilitado',
    description: 'Demonstre interesse e solicite contato para saber mais sobre um veículo.',
  },
];

export function AboutPage() {
  return (
    <main className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10 lg:py-16">
      <section className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand">
          Sobre a DriveLink
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-5xl">
          Seu próximo carro começa com uma boa escolha.
        </h1>
        <p className="mt-5 text-base leading-7 text-slate-600 sm:text-lg">
          A DriveLink é uma plataforma criada para facilitar a busca por veículos,
          reunindo informações em um só lugar e aproximando pessoas interessadas
          de uma experiência de atendimento mais simples.
        </p>
      </section>

      <section className="mt-12 grid gap-5 md:grid-cols-3" aria-label="Benefícios da plataforma">
        {benefits.map(({ icon: Icon, title, description }) => (
          <Card key={title} className="h-full">
            <Icon size={28} className="text-brand" aria-hidden="true" />
            <h2 className="mt-4 text-xl font-bold text-slate-950">{title}</h2>
            <p className="mt-2 leading-6 text-slate-600">{description}</p>
          </Card>
        ))}
      </section>

      <section className="mt-12 rounded-2xl bg-slate-950 p-7 text-white sm:p-10">
        <h2 className="text-2xl font-bold sm:text-3xl">
          Encontre opções para o seu próximo caminho.
        </h2>
        <p className="mt-3 max-w-2xl leading-7 text-slate-300">
          Explore o estoque disponível e conheça os detalhes dos veículos
          cadastrados na plataforma.
        </p>
        <Button to="/estoque" variant="inverse" className="mt-6">
          Explorar estoque <ArrowRight size={18} aria-hidden="true" />
        </Button>
      </section>
    </main>
  );
}