import { ArrowRight, Mail, MessageCircle, UserRound } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

const contactOptions = [
  {
    icon: MessageCircle,
    title: 'Solicite atendimento',
    description: 'Envie seus dados para que a equipe possa entrar em contato.',
  },
  {
    icon: Mail,
    title: 'Informe sua dúvida',
    description: 'Use o formulário para explicar como podemos ajudar.',
  },
  {
    icon: UserRound,
    title: 'Fale sobre um veículo',
    description: 'Acesse o estoque e consulte os detalhes do veículo de seu interesse.',
  },
];

export function ContactPage() {
  return (
    <main className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10 lg:py-16">
      <section className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand">
          Estamos aqui para ajudar
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-5xl">
          Entre em contato com a DriveLink.
        </h1>
        <p className="mt-5 text-base leading-7 text-slate-600 sm:text-lg">
          Quer saber mais sobre um veículo ou precisa de ajuda para encontrar
          uma opção? Envie sua solicitação pelo nosso formulário de atendimento.
        </p>
      </section>

      <section className="mt-10 grid gap-5 md:grid-cols-3" aria-label="Opções de contato">
        {contactOptions.map(({ icon: Icon, title, description }) => (
          <Card key={title} className="h-full">
            <Icon size={28} className="text-brand" aria-hidden="true" />
            <h2 className="mt-4 text-xl font-bold text-slate-950">{title}</h2>
            <p className="mt-2 leading-6 text-slate-600">{description}</p>
          </Card>
        ))}
      </section>

      <section className="mt-10 rounded-2xl border border-slate-200 p-7 sm:p-10">
        <h2 className="text-2xl font-bold text-slate-950">Como podemos ajudar?</h2>
        <p className="mt-3 max-w-2xl leading-7 text-slate-600">
          Acesse o formulário de atendimento para informar seus dados e sua
          preferência de contato. Se estiver procurando um carro específico,
          você também pode começar pelo nosso estoque.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button to="/atendimento">
            Solicitar atendimento <ArrowRight size={18} aria-hidden="true" />
          </Button>
          <Button to="/estoque" variant="outline">
            Ver estoque
          </Button>
        </div>
      </section>
    </main>
  );
}