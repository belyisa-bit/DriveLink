export function DemoDataNotice() {
  if (!import.meta.env.DEV || import.meta.env.VITE_USE_MOCK_CATALOG !== 'true') return null;

  return (
    <p role="note" className="mx-auto my-4 max-w-7xl rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950 sm:px-6">
      Modo demonstração: veículos, preços e disponibilidade são fictícios. Nenhum interesse enviado será salvo.
    </p>
  );
}
