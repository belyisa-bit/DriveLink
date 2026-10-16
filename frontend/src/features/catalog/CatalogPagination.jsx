import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../../components/Button';

export const catalogPageSize = 10;

export function CatalogPagination({ page, totalModels, onPageChange }) {
  const totalPages = Math.ceil(totalModels / catalogPageSize);
  if (totalPages <= 1) return null;
  const pages = totalPages <= 7 ? Array.from({ length: totalPages }, (_, index) => index) : Array.from(new Set([0, page - 1, page, page + 1, totalPages - 1])).filter((value) => value >= 0 && value < totalPages).sort((a, b) => a - b);
  return (
    <nav aria-label="Paginação do estoque" className="mt-8 space-y-4 border-t border-slate-200 pt-6">
      <p aria-live="polite" aria-atomic="true" className="text-center text-sm text-slate-600">Mostrando {page * catalogPageSize + 1}–{Math.min((page + 1) * catalogPageSize, totalModels)} de {totalModels} modelos</p>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button variant="outline" aria-label="Página anterior" disabled={page === 0} onClick={() => onPageChange(page - 1)} className="min-h-10 px-3 py-2"><ChevronLeft size={18} aria-hidden="true" /><span className="hidden sm:inline">Anterior</span></Button>
        {pages.map((value, index) => <span key={value} className="inline-flex items-center gap-2">{index > 0 && value - pages[index - 1] > 1 && <span aria-hidden="true" className="px-1 text-slate-500">…</span>}<Button variant={value === page ? 'primary' : 'outline'} aria-label={`Ir para a página ${value + 1}`} aria-current={value === page ? 'page' : undefined} onClick={() => onPageChange(value)} className="min-h-10 min-w-10 px-3 py-2">{value + 1}</Button></span>)}
        <Button variant="outline" aria-label="Próxima página" disabled={page === totalPages - 1} onClick={() => onPageChange(page + 1)} className="min-h-10 px-3 py-2"><span className="hidden sm:inline">Próxima</span><ChevronRight size={18} aria-hidden="true" /></Button>
      </div>
    </nav>
  );
}
