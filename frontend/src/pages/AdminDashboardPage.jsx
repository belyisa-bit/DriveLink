const adminSections = [
  {
    title: 'Veículos',
    description: 'Gerencie o cadastro e as informações dos veículos.',
    path: '/admin/veiculos',
  },
  {
    title: 'Leads',
    description: 'Consulte os contatos e as solicitações de atendimento.',
    path: '/admin/leads',
  },
];

export function AdminDashboardPage() {
  return (
    <main className="mx-auto min-h-[70vh] max-w-7xl px-5 py-12 sm:px-8 lg:px-10">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">
          DriveLink
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950">
          Painel administrativo
        </h1>
        <p className="mt-3 text-slate-600">
          Acesse as áreas de gerenciamento da plataforma.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {adminSections.map((section) => (
          <section
            key={section.path}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <h2 className="text-xl font-semibold text-slate-950">
              {section.title}
            </h2>
            <p className="mt-2 text-slate-600">{section.description}</p>
            <p className="mt-5 text-sm text-slate-500">
              Área em preparação
            </p>
          </section>
        ))}
      </div>
    </main>
  );
}